// server/utils/airtable.ts
import Airtable from "airtable";
import type { H3Event } from "h3";
import { createError } from "h3";
import { useRuntimeConfig } from "#imports";

// Minimal options type – just what your code actually uses
export type AirtableSelectOptions = {
  view?: string;
  maxRecords?: number;
  filterByFormula?: string;
  sort?: { field: string; direction: "asc" | "desc" }[];
};

export function getAirtableBase(event?: H3Event) {
  const config = useRuntimeConfig(event);

  const { atApiKey } = config.private;
  const { atBaseId } = config.public;

  return new Airtable({ apiKey: atApiKey }).base(atBaseId);
}

export function getAirtableTable(tableName: string, event?: H3Event) {
  return getAirtableBase(event)(tableName);
}

/**
 * Standardised read helper – returns plain JSON [{ id, ...fields }]
 */
export async function airtableSelect<T = any>(
  tableName: string,
  options: AirtableSelectOptions,
  event?: H3Event
): Promise<T[]> {
  const table = getAirtableTable(tableName, event);

  try {
    const records = await table.select(options).firstPage();

    return records.map((record: any) => ({
      id: record.id,
      ...record.fields,
    })) as T[];
  } catch (err: any) {
    console.error(`[airtableSelect] ${tableName} error`, {
      statusCode: err?.statusCode,
      error: err?.error,
      message: err?.message,
    });

    // Airtable quota exceeded → return empty array, never crash SSR
    if (
      err?.statusCode === 429 ||
      err?.error === "PUBLIC_API_BILLING_LIMIT_EXCEEDED"
    ) {
      return [];
    }

    throw createError({
      statusCode: 503,
      statusMessage: `Upstream Airtable table "${tableName}" unavailable`,
    });
  }
}

/**
 * Standardised create helper – wraps table.create() and normalises output
 */
export async function airtableCreate<T = any>(
  tableName: string,
  fields: any,
  event?: H3Event
): Promise<T> {
  const table = getAirtableTable(tableName, event);

  try {
    const created: any = await table.create(fields);
    const record = Array.isArray(created) ? created[0] : created;

    return {
      id: record.id,
      ...record.fields,
    } as T;
  } catch (err: any) {
    console.error(`[airtableCreate] ${tableName} error`, {
      statusCode: err?.statusCode,
      error: err?.error,
      message: err?.message,
    });

    throw createError({
      statusCode: 502,
      statusMessage: `Failed to create record in "${tableName}"`,
    });
  }
}

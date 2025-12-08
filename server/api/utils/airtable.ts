// server/utils/airtable.ts
//
// Centralised Airtable helpers for Nuxt/Nitro.
// - Reads runtimeConfig for API key and base ID
// - Normalises SELECT results to { id, ...fields }
// - Normalises CREATE input to [{ fields: { ... } }]
// - Flattens CREATE responses back to { id, ...fields }

import Airtable from "airtable";
import type { H3Event } from "h3";
import { createError } from "h3";

type AirtableFields = Record<string, unknown>;

interface AirtableSelectOptions {
  view?: string;
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  sort?: { field: string; direction?: "asc" | "desc" }[];
}

/**
 * Check if Airtable is disabled in runtime config.
 */
function isAirtableDisabled(event?: H3Event): boolean {
  const config = useRuntimeConfig(event);
  const { airtableDisabled } = (config.private || config) as {
    airtableDisabled?: boolean;
  };
  return airtableDisabled === true;
}

/**
 * Resolve Airtable base using Nuxt runtime config.
 * Note: This function will throw if Airtable is disabled.
 * Use isAirtableDisabled() to check before calling this.
 */
export function getAirtableBase(event?: H3Event) {
  const config = useRuntimeConfig(event);

  const { atApiKey, airtableDisabled } = (config.private || config) as {
    atApiKey: string;
    airtableDisabled?: boolean;
  };

  const { atBaseId } = (config.public || config) as {
    atBaseId: string;
  };

  if (!atApiKey || !atBaseId) {
    throw new Error(
      "Airtable configuration missing: atApiKey and/or atBaseId are not set.",
    );
  }

  if (airtableDisabled) {
    throw new Error("Airtable access is disabled by configuration.");
  }

  return new Airtable({ apiKey: atApiKey }).base(atBaseId);
}

/**
 * Get a specific Airtable table instance.
 */
export function getAirtableTable(tableName: string, event?: H3Event) {
  const base = getAirtableBase(event);
  return base(tableName);
}

/**
 * Flatten Airtable SDK record into { id, ...fields }.
 */
function flattenRecord(record: any): AirtableFields {
  return {
    id: record.id,
    ...(record.fields as AirtableFields),
  };
}

/**
 * SELECT helper:
 * Wraps table.select(...).all() and returns flattened records.
 * When Airtable is disabled, throws a 503 error that guardedFetch can handle.
 */
export async function airtableSelect(
  tableName: string,
  options: AirtableSelectOptions = {},
  event?: H3Event,
) {
  // Check if Airtable is disabled before attempting any operations
  if (isAirtableDisabled(event)) {
    if (event) {
      throw createError({
        statusCode: 503,
        statusMessage: "Service Unavailable",
        message: "Airtable access is disabled by configuration.",
      });
    }
    // If no event provided, throw a regular error (shouldn't happen in API routes)
    throw new Error("Airtable access is disabled by configuration.");
  }

  const table = getAirtableTable(tableName, event);

  const records = await table
    .select(options as any)
    .all()
    .catch((err: any) => {
      // Surface Airtable errors clearly in Nitro logs
      console.error("[airtableSelect] Error selecting from", tableName, err);
      throw err;
    });

  return records.map(flattenRecord);
}

/**
 * CREATE helper:
 * Accepts either:
 *   - a plain fields object: { fieldA: ..., fieldB: ... }
 *   - an array of plain fields objects: [{ ... }, { ... }]
 *   - or already-shaped { fields: { ... } } objects
 *
 * Always sends [{ fields: { ... } }] to Airtable,
 * and always returns flattened { id, ...fields }.
 * When Airtable is disabled, throws a 503 error that guardedFetch can handle.
 */
export async function airtableCreate(
  tableName: string,
  recordOrRecords:
    | AirtableFields
    | AirtableFields[]
    | { fields: AirtableFields }
    | { fields: AirtableFields }[],
  event?: H3Event,
) {
  // Check if Airtable is disabled before attempting any operations
  if (isAirtableDisabled(event)) {
    if (event) {
      throw createError({
        statusCode: 503,
        statusMessage: "Service Unavailable",
        message: "Airtable access is disabled by configuration.",
      });
    }
    // If no event provided, throw a regular error (shouldn't happen in API routes)
    throw new Error("Airtable access is disabled by configuration.");
  }

  const table = getAirtableTable(tableName, event);

  const inputArray = Array.isArray(recordOrRecords)
    ? recordOrRecords
    : [recordOrRecords];

  // Normalise to Airtable's expected shape: [{ fields: { ... } }]
  const recordsPayload = inputArray.map(item => {
    if (item && typeof item === "object" && "fields" in item) {
      // Already { fields: { ... } }
      return item as { fields: AirtableFields };
    }

    // Plain fields object → wrap it
    return { fields: item as AirtableFields };
  });

  const created = await table
    .create(recordsPayload as any, { typecast: true }) // <- CHANGED: enable Airtable typecasting
    .catch((err: any) => {
      console.error("[airtableCreate] Error creating in", tableName, err);
      throw err;
    });

  // Airtable SDK always returns an array from create()
  const flattened = created.map(flattenRecord);

  // Mirror caller intent: single in → single out, array in → array out
  if (!Array.isArray(recordOrRecords)) {
    return flattened[0];
  }

  return flattened;
}

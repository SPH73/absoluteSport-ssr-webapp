import { readBody } from "h3";
import { airtableCreate } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const fields = await readBody(event);

  const created = await airtableCreate("fa-bookings", fields, event);

  return created;
});

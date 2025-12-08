import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "sportList",
    {
      filterByFormula: 'NOT(display = "false")',
      sort: [{ field: "sportName", direction: "asc" }],
    },
    event
  );

  return records;
});

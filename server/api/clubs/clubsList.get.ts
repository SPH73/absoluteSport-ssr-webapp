import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "clubsList",
    {
      filterByFormula: 'AND(spaceAvailable > 0, status = "upcoming")',
      sort: [{ field: "clubName", direction: "asc" }],
    },
    event
  );

  return records;
});

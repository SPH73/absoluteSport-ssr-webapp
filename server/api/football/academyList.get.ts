import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "faList",
    {
      filterByFormula: 'AND(spaceAvailable > 0, status = "upcoming")',
      sort: [{ field: "academyName", direction: "asc" }],
    },
    event
  );

  return records;
});

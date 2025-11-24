import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "partiesContent",
    {
      view: "Party Details",
      filterByFormula: "NOT({featured} = 'true')",
      sort: [{ field: "partyName", direction: "asc" }],
    },
    event
  );

  return records;
});

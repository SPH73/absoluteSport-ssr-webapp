import { airtableSelect } from "./utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "cms",
    {
      view: "allCMS",
      filterByFormula: "NOT({display} = 'false')",
    },
    event
  );

  return records;
});

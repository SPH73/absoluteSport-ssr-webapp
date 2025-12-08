import { airtableSelect } from "./utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "FAQs",
    {
      view: "allFAQs",
    },
    event
  );

  return records;
});

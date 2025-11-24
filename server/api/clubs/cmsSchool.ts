import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "cms",
    {
      view: "schools",
      filterByFormula: 'NOT({display} = "false")',
    },
    event
  );

  if (!records || records.length === 0) {
    throw Error("Unable to fetch content");
  }
  console.log("airtable cms", records);

  return records;
});

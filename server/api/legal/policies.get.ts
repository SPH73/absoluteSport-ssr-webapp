import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "policies",
    {
      view: "Grid view",
    },
    event
  );

  return records;
});

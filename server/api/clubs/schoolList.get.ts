import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "schoolList",
    {
      sort: [{ field: "schoolName", direction: "asc" }],
    },
    event
  );

  return records;
});

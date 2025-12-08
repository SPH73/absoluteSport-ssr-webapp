import { airtableSelect } from "./utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "reviews",
    {
      view: "allReviews",
    },
    event
  );

  return records;
});

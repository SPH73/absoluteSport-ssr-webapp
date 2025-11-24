import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "schoolsTestimonials",
    {
      filterByFormula: 'NOT(featured = "false")',
      sort: [{ field: "school", direction: "desc" }],
    },
    event
  );

  return records;
});

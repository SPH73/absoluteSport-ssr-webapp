import Airtable from "airtable";

export default defineEventHandler(async () => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("schoolsTestimonials");

  const records = await table
    .select({
      filterByFormula: 'NOT(featured = "false")',
      sort: [{ field: "school", direction: "desc" }],
    })
    .firstPage();
  if (!records) {
    throw Error("Unable to fetch testimonials");
  }
  // console.log("airtable schoolTests", records);

  return records;
});

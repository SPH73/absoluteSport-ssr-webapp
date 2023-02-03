import Airtable from "airtable";

export default defineEventHandler(async event => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("schoolList");

  const records = await table
    .select({
      // filterByFormula: 'NOT(status = "full")',
      sort: [{ field: "schoolName", direction: "asc" }],
    })
    .firstPage();
  if (!records) {
    throw Error("Unable to fetch data");
  }

  return records;
});

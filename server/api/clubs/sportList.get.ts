import Airtable from "airtable";

export default defineEventHandler(async event => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("sportList");

  const records = await table
    .select({
      filterByFormula: 'NOT(display = "false")',
      sort: [{ field: "sportName", direction: "asc" }],
    })
    .firstPage();
  if (!records) {
    throw Error("Unable to fetch list");
  }
  console.log("airtable sportList", records);
  return records;
});

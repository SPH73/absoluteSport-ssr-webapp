import Airtable from "airtable";

export default defineEventHandler(async event => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("faList");

  const records = await table
    .select({
      filterByFormula: 'AND(spaceAvailable > 0, status = "upcoming")',
      sort: [{ field: "academyName", direction: "asc" }],
    })
    .firstPage();
  if (!records) {
    throw Error("Unable to retireive football academy list data");
  }

  return records;
});

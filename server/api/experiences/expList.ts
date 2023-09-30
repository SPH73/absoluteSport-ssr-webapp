import Airtable from "airtable";

export default defineEventHandler(async (event) => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("expList");

  const records = await table
    .select({
      view: "Grid view",
      // maxRecords: 2,
      filterByFormula: "NOT(spaceAvailable = 0, status = 'past')",
      sort: [
        {
          field: "expDateTime",
          direction: "asc",
        },
      ],
    })
    .firstPage();
  if (!records) {
    throw Error("Unable to fetch upcoming experiences data");
  }

  return records;
});

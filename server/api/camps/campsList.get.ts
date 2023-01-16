import Airtable from "airtable";

export default defineEventHandler(async event => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("campsList");

  const records = await table
    .select({
      view: "Grid view",
      // maxRecords: 2,
      filterByFormula: "NOT({status} = 'past')",
      sort: [
        {
          field: "ws",
          direction: "asc",
        },
      ],
    })
    .firstPage();
  if (!records) {
    throw Error("Unable to fetch available camps");
  }

  return records;
});

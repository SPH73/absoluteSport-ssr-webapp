import Airtable from "airtable";

export default defineEventHandler(async (event) => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("expVenueList");

  const records = await table
    .select({
      view: "Grid view",
    })
    .firstPage();
  if (!records) {
    throw Error("Unable to fetch available experience venues");
  }

  return records;
});

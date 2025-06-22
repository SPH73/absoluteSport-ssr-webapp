import Airtable from "airtable";

export default defineEventHandler(async () => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("carouselImages");

  const assets = await table
    .select({ filterByFormula: 'NOT({display} = "false")' })
    .firstPage();
  if (!assets) {
    throw Error("Unable to fetch assets");
  }
  // console.log("airtable assets", assets);

  return assets;
});

import Airtable from "airtable";

export default defineEventHandler(async () => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("FAQs");

  const records = await table.select({ view: "allFAQs" }).firstPage();
  if (!records) {
    throw Error("Unable to fetch faqs");
  }
  // console.log('airtable reviews', records)

  return records;
});

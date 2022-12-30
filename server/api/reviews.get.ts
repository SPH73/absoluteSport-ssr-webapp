import Airtable from "airtable";


export default defineEventHandler(async () => {
  const { atApiKey } = useRuntimeConfig().private;
  const {atBaseId} = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base('reviews')

  const records = await table.select({maxRecords: 1, view: 'allReviews'}).firstPage();
  if (!records) {
    throw Error('Unable to fetch reviews')
  }
    // console.log('airtable reviews', records)

    return records
})

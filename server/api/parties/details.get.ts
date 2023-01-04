import Airtable from "airtable";


export default defineEventHandler(async (event) => {
  const { atApiKey } = useRuntimeConfig().private;
  const {atBaseId} = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base('partiesContent')

  const records = await table.select({view: 'Party Details', }).firstPage();
  if (!records) {
    throw Error('Unable to fetch party data')
  }
    // console.log('airtable party content', records)

    return records
})

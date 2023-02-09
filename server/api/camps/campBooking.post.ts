import Airtable from "airtable";
const minifyData = (record: any) => {
  return {
    fields: record.fields,
    id: record.id,
  };
};

export default defineEventHandler(async fields => {
  const { atApiKey } = useRuntimeConfig().private;
  const { atBaseId } = useRuntimeConfig().public;
  const base = new Airtable({ apiKey: atApiKey }).base(atBaseId);

  const table = base("camp-bookings");
  const record = await readBody(fields);

  const createdRecord = await table.create(record);
  return minifyData(createdRecord);
});

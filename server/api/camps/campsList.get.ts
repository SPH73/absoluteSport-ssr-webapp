import { airtableSelect } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const records = await airtableSelect(
    "campsList",
    {
      view: "Grid view",
      filterByFormula: "NOT(spaceAvailable = 0, status = 'past')",
      sort: [
        {
          field: "ws",
          direction: "asc",
        },
      ],
    },
    event
  );

  return records;
});

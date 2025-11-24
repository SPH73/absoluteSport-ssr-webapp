import { airtableSelect } from "./utils/airtable";

export default defineEventHandler(async (event) => {
  const assets = await airtableSelect(
    "carouselImages",
    {
      filterByFormula: 'NOT({display} = "false")',
    },
    event
  );

  return assets;
});

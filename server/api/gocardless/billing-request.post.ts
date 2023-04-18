import { GoCardlessClient } from "gocardless-nodejs/client";
import constants from "gocardless-nodejs/constants";

const gcAccessToken = useRuntimeConfig().private.gcAccessToken;
const gocardless = new GoCardlessClient(
  gcAccessToken,
  constants.Environments.Live,
);
export default defineEventHandler(async data => {
  const details = await readBody(data);
  try {
    const billingRequest = await gocardless.billingRequests.create({
      payment_request: {
        description: details.description,
        amount: details.amount,
        currency: "GBP",
        app_fee: details.amount,
      },
      fallback_enabled: true,
    });
    console.log("billing request", billingRequest);
    return billingRequest.id;
  } catch (error) {
    console.error("billing request error message", error);
    return console.error;
  }
});

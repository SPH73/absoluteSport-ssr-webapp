import { GoCardlessClient } from "gocardless-nodejs/client";
import constants from "gocardless-nodejs/constants";

const gcAccessToken = useRuntimeConfig().private.gcAccessToken;
const gocardless = new GoCardlessClient(
  gcAccessToken,
  constants.Environments.Live,
);
export default defineEventHandler(async data => {
  const paymentDetails = await readBody(data);
  const billingRequestFlow = await gocardless.billingRequestFlows.create({
    redirect_uri: `https://absolutesport.org/payment/success`,
    exit_uri: `https://https://absolutesport.org/payment/exit?amount=${paymentDetails.amount}?paymentRef=${paymentDetails.paymentRef}`,
    links: {
      billing_request: paymentDetails.id,
    },
  });
  console.log("billing request flow", billingRequestFlow);
  return billingRequestFlow;
});

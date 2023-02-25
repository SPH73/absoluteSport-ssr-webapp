import mailchimp from "@mailchimp/mailchimp_marketing";

export default defineEventHandler(async event => {
  const { mcApiKey } = useRuntimeConfig().private;
  const { mcAudId } = useRuntimeConfig().public;
  const { mcServer } = useRuntimeConfig().public;

  mailchimp.setConfig({
    apiKey: mcApiKey,
    server: mcServer,
  });

  const { email, firstName, lastName } = await readBody(event);

  if (!email) {
    console.error("Missing `email` in the subscribe body");
    return;
  }

  let result;

  try {
    const response = await mailchimp.lists.addListMember(mcAudId, {
      email_address: email,
      status: "pending",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    });
    console.log(response);

    result = {
      message: `New subscriber added  to Mailchimp  with email ${response.email_address}`,
      status: 200,
    };
  } catch (err) {
    result = { message: err.response.body.title, status: err.status };
  }

  if (result.status !== 200)
    throw createError({
      statusCode: result.status,
      statusMessage: result.message,
    });

  return result;
});

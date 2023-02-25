import mailchimp from "@mailchimp/mailchimp_marketing";
import md5 from "md5";

export default defineEventHandler(async event => {
  const { mcApiKey } = useRuntimeConfig().private;
  const { mcAudId } = useRuntimeConfig().public;
  const { mcServer } = useRuntimeConfig().public;

  mailchimp.setConfig({
    apiKey: mcApiKey,
    server: mcServer,
  });

  const { email, firstName, lastName, tags } = await readBody(event);

  if (!email) {
    console.error("Missing `email` in the subscribe body");
    return;
  }

  let result;

  const subscriber_hash = md5(email);

  try {
    const response = await mailchimp.lists.setListMember(
      mcAudId,
      subscriber_hash,
      {
        email_address: email,
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
        tags: tags,
      },
    );

    console.log(response);

    result = {
      // message: `New subscriber added to Mailchimp  with email ${response.email_address}`,
      message: response.status,
      status: 200,
    };

    console.log("result", result);
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

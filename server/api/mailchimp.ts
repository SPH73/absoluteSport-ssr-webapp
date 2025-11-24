// server/api/mailchimp.ts
import mailchimp from "@mailchimp/mailchimp_marketing";
import md5 from "md5";
import { defineEventHandler, readBody, createError } from "h3";
import { useRuntimeConfig } from "#imports";

type SubscribeBody = {
  email: string;
  firstName?: string;
  lastName?: string;
  // frontend can send a single tag or an array
  tags?: string | string[];
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { mcApiKey } = config.private;
  const { mcAudId, mcServer } = config.public;

  // Configure SDK – per Mailchimp docs
  mailchimp.setConfig({
    apiKey: mcApiKey,
    server: mcServer,
  });

  const { email, firstName, lastName, tags }: SubscribeBody =
    await readBody<SubscribeBody>(event);

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing `email` in the subscribe body",
    });
  }

  const subscriber_hash = md5(email.toLowerCase());

  // Derive the correct body type from the SDK itself
  type SetListMemberBody = Parameters<typeof mailchimp.lists.setListMember>[2];

  const payload: SetListMemberBody = {
    email_address: email,
    status_if_new: "subscribed", // literal, matches the SDK Status union
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
    ...(tags && {
      tags: Array.isArray(tags) ? tags : [tags],
    }),
  };

  let result: { message: string; status: number };

  try {
    const response = await mailchimp.lists.setListMember(
      mcAudId,
      subscriber_hash,
      payload
    );

    result = {
      message: String(response.status ?? "subscribed"),
      status: 200,
    };
  } catch (error: unknown) {
    const mcErr = error as {
      response?: { body?: { title?: string } };
      status?: number;
    };

    console.error("[mailchimp] subscribe error", mcErr);

    result = {
      message: mcErr?.response?.body?.title ?? "Mailchimp subscription failed",
      status: mcErr?.status ?? 500,
    };
  }

  if (result.status !== 200) {
    throw createError({
      statusCode: result.status,
      statusMessage: result.message,
    });
  }

  return result;
});

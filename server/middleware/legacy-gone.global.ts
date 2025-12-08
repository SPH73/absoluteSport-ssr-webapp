import { defineEventHandler } from "h3";

const gonePaths = [
  "/contact-us", // old wix
  "/store", // old wix
  "/faq's", // malformed apostrophe URL
  // add all from the GSC dump
];

export default defineEventHandler((event) => {
  const path = event.node.req.url?.split("?")[0] || "/";

  if (gonePaths.includes(path)) {
    // Let it register in legacy table AFTER quota resets
    event.node.res.statusCode = 410;
    event.node.res.end("Gone");
  }
});

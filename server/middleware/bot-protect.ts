import { defineEventHandler, setResponseStatus } from "h3";
import { appendFile } from "fs/promises";
import { join } from "path";

const allowedBots = [/Googlebot/i, /Bingbot/i, /Slurp/i, /DuckDuckBot/i];

const blockPatterns = [
  /\.php$/, // Block any .php requests
  /wp-/i, // WordPress paths
  /xmlrpc/i,
  /#!/, // Hashbang URLs like #!/all
  /\?gclid=/, // Tracking parameters
];

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const url = req.url || "";
  const ua = req.headers["user-agent"] || "";
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Log all suspicious requests
  if (blockPatterns.some((p) => p.test(url))) {
    const logLine = `${new Date().toISOString()} | ${ip} | ${ua} | ${url}\n`;
    await appendFile(
      join(process.cwd(), "logs", "suspicious-bots.log"),
      logLine
    );

    // Block repeat offenders
    const isAllowedBot = allowedBots.some((bot) => bot.test(ua));
    if (!isAllowedBot) {
      setResponseStatus(event, 403, "Forbidden");
      return "Forbidden";
    }
  }
});

import { chromium } from "@playwright/test";

const [url, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const problems = [];
page.on("console", (m) => {
  if (m.type() === "error") problems.push("CONSOLE: " + m.text());
});
page.on("pageerror", (e) => problems.push("PAGEERROR: " + e.message));
page.on("requestfailed", (r) => problems.push("REQFAILED: " + r.url() + " " + r.failure()?.errorText));

const res = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: out });

console.log("HTTP:", res.status());
console.log("TITLE:", await page.title());
const text = (await page.locator("body").innerText()).replace(/\n{2,}/g, "\n").trim();
console.log("TEXTO_RENDERIZADO:\n" + text.slice(0, 1200));
console.log("PROBLEMAS:", problems.length ? "\n" + problems.join("\n") : "nenhum");

await browser.close();

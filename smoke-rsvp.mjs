import { chromium } from "@playwright/test";

const out = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const problems = [];
page.on("console", (m) => {
  if (m.type() === "error") problems.push("CONSOLE: " + m.text());
});
page.on("pageerror", (e) => problems.push("PAGEERROR: " + e.message));

await page.goto("http://localhost:8080/convite", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);

// Vai direto para a seção de confirmação e busca uma família existente.
await page.locator("text=CONFIRMAÇÃO").first().click();
await page.waitForTimeout(1500);

const input = page.locator('input[type="text"], input:not([type])').first();
await input.fill("Renzo");
await page.getByRole("button", { name: /buscar/i }).click();
await page.waitForTimeout(2500);
await page.screenshot({ path: out });

const text = (await page.locator("body").innerText()).replace(/\n{2,}/g, "\n");
const idx = text.indexOf("Confirme sua presença");
console.log("RESULTADO_DA_BUSCA:\n" + text.slice(idx, idx + 600));
console.log("PROBLEMAS:", problems.length ? "\n" + problems.join("\n") : "nenhum");

await browser.close();

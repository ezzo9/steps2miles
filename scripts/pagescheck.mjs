import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });

await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/about_page.png", fullPage: true });

await page.goto("http://localhost:3000/privacy", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/privacy_page.png", fullPage: true });

await browser.close();

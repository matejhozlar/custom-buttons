const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const outDir = path.join(process.cwd(), "out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 200, height: 60, deviceScaleFactor: 2 });
  await page.goto(`file://${path.join(process.cwd(), "buttons.html")}`, {
    waitUntil: "networkidle0",
  });
  await page.emulateMediaType("screen");

  const selector = "#button";
  await page.waitForSelector(selector);

  const clip = await page.$eval(selector, (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.floor(r.x),
      y: Math.floor(r.y),
      width: Math.ceil(r.width),
      height: Math.ceil(r.height),
    };
  });

  await page.screenshot({
    path: path.join(outDir, "website_button_normal.png"),
    omitBackground: true,
    clip,
  });

  await page.goto(
    `file://${path.join(process.cwd(), "buttons.html")}?state=hover`,
    { waitUntil: "networkidle0" }
  );
  await page.waitForSelector(selector);
  const clip2 = await page.$eval(selector, (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.floor(r.x),
      y: Math.floor(r.y),
      width: Math.ceil(r.width),
      height: Math.ceil(r.height),
    };
  });
  await page.screenshot({
    path: path.join(outDir, "website_button_hover.png"),
    omitBackground: true,
    clip: clip2,
  });

  await browser.close();
  console.log(
    "Saved to ./out/website_button_normal.png and ./out/website_button_hover.png"
  );
})();

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const outDir = path.join(process.cwd(), "out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 240, height: 80, deviceScaleFactor: 4 });
  await page.goto(`file://${path.join(process.cwd(), "buttons.html")}`, {
    waitUntil: "networkidle0",
  });

  async function screenshotButton(id, outFile, hover = false) {
    const el = await page.$(id);
    if (!el) throw new Error(`No element with selector ${id}`);

    const box = await el.boundingBox();
    if (hover) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 250));
    }

    await page.screenshot({
      path: path.join(outDir, outFile),
      omitBackground: true,
      clip: {
        x: Math.floor(box.x),
        y: Math.floor(box.y),
        width: Math.ceil(box.width),
        height: Math.ceil(box.height),
      },
    });

    if (hover) {
      await page.mouse.move(0, 0);
    }
  }

  //   await screenshotButton("#official", "official_normal.png");
  //   await screenshotButton("#official", "official_hover.png", true);

  await screenshotButton("#discord", "discord_normal.png");
  await screenshotButton("#discord", "discord_hover.png", true);

  await browser.close();
  console.log("Screenshots saved in ./out/");
})();

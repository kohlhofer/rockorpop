import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const TOTAL_COVERS = 5;
const TOTAL_BODY_COLORS = 10;
const TOTAL_BACKGROUNDS = 24;

async function generateOGImage(cover: number, bodyColor: number, background: number) {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1200, height: 630 });
  
  // Construct and encode URL parameters
  const params = new URLSearchParams({
    preview: 'true',
    cover: cover.toString(),
    shell: bodyColor.toString(),
    bg: background.toString()
  });
  
  const url = `http://localhost:3000/?${params.toString()}`;
  console.log('Navigating to:', url);
  
  await page.goto(url, {
    waitUntil: 'networkidle0'
  });
  
  // Enable console logging from the page
  page.on('console', msg => console.log('Browser console:', msg.text()));
  
  // Wait for the cassette to be rendered
  await page.waitForSelector('.tape');
  
  // Create the output directory if it doesn't exist
  const outputDir = path.join(process.cwd(), 'public', 'og-image');
  await fs.mkdir(outputDir, { recursive: true });
  
  // Take a screenshot
  await page.screenshot({
    path: `${outputDir}/${cover}-${bodyColor}-${background}.png` as `${string}.png`,
    type: 'png'
  });
  
  await browser.close();
}

async function main() {
  console.log('Starting OG image generation...');
  
  for (let cover = 1; cover <= TOTAL_COVERS; cover++) {
    for (let bodyColor = 1; bodyColor <= TOTAL_BODY_COLORS; bodyColor++) {
      for (let background = 1; background <= TOTAL_BACKGROUNDS; background++) {
        console.log(`Generating image for cover=${cover}, bodyColor=${bodyColor}, background=${background}`);
        await generateOGImage(cover, bodyColor, background);
      }
    }
  }
  
  console.log('OG image generation complete!');
}

main().catch(console.error); 
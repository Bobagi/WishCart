import puppeteer from 'puppeteer';
import logger from '../logger';

export async function scrapeMercadoLivreProducts(keyword: string) {
  logger.info(`Scraping Mercado Livre for: ${keyword}`);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  logger.info('Browser launched');	
  const page = await browser.newPage();
  logger.info('Page created');
  
  const searchUrl = `https://www.mercadolivre.com.br/jm/search?as_word=${encodeURIComponent(keyword)}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  logger.info('Page loaded');

  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.ui-search-result__content')).map(product => {
      const title = product.querySelector('.ui-search-item__title')?.textContent?.trim() || 'No title';
      const price = product.querySelector('.price-tag-fraction')?.textContent?.trim() || 'No price';
      const link = product.querySelector('a')?.href || 'No link';

      const image = product.querySelector('img')?.getAttribute('data-src') ||
                    product.querySelector('img')?.getAttribute('srcset') ||
                    product.querySelector('img')?.src ||
                    'No image';

      return { title, price, link, image };
    });
  });

  logger.info('Products scraped:', products);

  await browser.close();
  return products;
}
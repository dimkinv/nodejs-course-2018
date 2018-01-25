import axios from 'axios';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';

export default class Scrapper {
    static readonly productTitleRegex = /<span.*productTitle(.|\s)*<\/span>/;
    static async scrapeProductForUrl(url: string) {
        try {
            // const response = await axios.get(url);
            const html = fs.readFileSync('test.html').toString('utf8');
            console.log(html.match(Scrapper.productTitleRegex));
            // console.log(Scrapper.productTitleRegex.exec(html)[0]);
            
            // const title = new JSDOM(Scrapper.productTitleRegex.exec(html)[0]);
            console.log(title);
        } catch (e) {
            console.error('Error fetching amazon product', e);
            throw e;
        }
    }
}

Scrapper.scrapeProductForUrl('https://www.amazon.com/AfterShokz-Titanium-Conduction-Headphones-AS600SG/dp/B018XNGQOE');

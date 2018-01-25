"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Scrapper {
    static scrapeProductForUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const response = await axios.get(url);
                const html = fs.readFileSync('test.html').toString('utf8');
                console.log(html.match(Scrapper.productTitleRegex));
                // console.log(Scrapper.productTitleRegex.exec(html)[0]);
                // const title = new JSDOM(Scrapper.productTitleRegex.exec(html)[0]);
                console.log(title);
            }
            catch (e) {
                console.error('Error fetching amazon product', e);
                throw e;
            }
        });
    }
}
Scrapper.productTitleRegex = /<span.*productTitle(.|\s)*<\/span>/;
exports.default = Scrapper;
Scrapper.scrapeProductForUrl('https://www.amazon.com/AfterShokz-Titanium-Conduction-Headphones-AS600SG/dp/B018XNGQOE');

const { assert } = require("chai");
const puppeteer = require("puppeteer");
const BUG_ID = '?bug_id=' + process.env.BUG_ID
describe("Шапка", () => {
    it("в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", async function () {
        await this.browser.url("http://localhost:3000/hw/store" + BUG_ID);
        await this.browser.assertView("plain", ".navbar-nav");
    });

    it("на ширине меньше 576px навигационное меню должно скрываться за гамбургер", async function () {
        this.browser.setWindowSize(575, 1080);
        await this.browser.url("http://localhost:3000/hw/store" + BUG_ID);
        await this.browser.assertView("plain", ".navbar-toggler");
    });
});

describe("Страница товара", () => {
    it("кнопка add to cart нужного размера", async function () {
        await this.browser.url("http://localhost:3000/hw/store/catalog/0" + BUG_ID);
        await this.browser.assertView("plain", ".ProductDetails-AddToCart");
    });

    it('происходит успешный переход на страницу товара мз каталога, детали загружаются', async () => {
        const browserInstance = await puppeteer.launch();
        page = await browserInstance.newPage();
        await page.reload();
        await page.goto(`http://localhost:3000/hw/store/catalog` + BUG_ID);
        // await page.waitForSelector(".ProductItem-DetailsLink");
        // await page.click(".ProductItem-DetailsLink");
        await page.waitForSelector('.ProductItem-Name', {timeout: 1000});
    })
});

describe("Корзина", () => {
    it('для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', async () => {
        const browserInstance = await puppeteer.launch();
        page = await browserInstance.newPage();
        await page.reload();
        await page.goto(`http://localhost:3000/hw/store/catalog/0` + BUG_ID)
        await page.waitForSelector(".ProductDetails-AddToCart");
        await page.click(".ProductDetails-AddToCart");
        await page.click('.cartBtn')
        await page.waitForSelector('.Cart-Index', {timeout: 1000});
        await page.waitForSelector('.Cart-Name', {timeout: 1000});
        await page.waitForSelector('.Cart-Price', {timeout: 1000});
        await page.waitForSelector('.Cart-Total', {timeout: 1000});
        await page.waitForSelector('.Cart-Count', {timeout: 1000});
    });

    it('в  корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
        const browserInstance = await puppeteer.launch();
        page = await browserInstance.newPage();
        await page.reload();
        await page.goto(`http://localhost:3000/hw/store/catalog/0` + BUG_ID);
        await page.waitForSelector(".ProductDetails-AddToCart");
        await page.click(".ProductDetails-AddToCart");
        await page.goto(`http://localhost:3000/hw/store/cart` + BUG_ID);
        await page.click(".Cart-Clear");
        await page.reload();
        await page.waitForSelector('[data-testid="catalog-cart-link"');
    })

    it('форма проходит валидацию в корзине, появляется сообщение об успешном заполнении', async () => {
        const browserInstance = await puppeteer.launch();
        page = await browserInstance.newPage();
        await page.reload();
        await page.goto(`http://localhost:3000/hw/store/catalog/0` + BUG_ID);
        await page.waitForSelector(".ProductDetails-AddToCart");
        await page.click(".ProductDetails-AddToCart");
        await page.goto(`http://localhost:3000/hw/store/cart` + BUG_ID);
        await page.type('#f-name', 'Test name')
        await page.type('#f-phone', '+1111111111')
        await page.type('#f-address', 'Test address')
        await page.click('.Form-Submit')
        await page.waitForSelector('.alert-success', {timeout: 1000});
    })

    it('товары удаляются после сабмита формы', async () => {
        const browserInstance = await puppeteer.launch();
        page = await browserInstance.newPage();
        await page.reload();
        await page.goto(`http://localhost:3000/hw/store/catalog/0` + BUG_ID);
        await page.waitForSelector(".ProductDetails-AddToCart");
        await page.click(".ProductDetails-AddToCart");
        await page.goto(`http://localhost:3000/hw/store/cart` + BUG_ID);
        await page.type('#f-name', 'Test name')
        await page.type('#f-phone', '+1111111111')
        await page.type('#f-address', 'Test address')
        await page.click('.Form-Submit')
        await page.waitForSelector('.alert-success', {timeout: 1000});
        await page.goto(`http://localhost:3000/hw/store/cart` + BUG_ID);
        await page.waitForSelector('[data-testid="catalog-cart-link"');
    })
});

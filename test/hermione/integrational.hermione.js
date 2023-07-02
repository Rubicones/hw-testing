const { assert } = require("chai");
const puppeteer = require("puppeteer");

describe("Шапка", () => {
    it("в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", async function () {
        await this.browser.url("http://localhost:3000/hw/store");
        await this.browser.assertView("plain", ".navbar-nav");
    });

    it("на ширине меньше 576px навигационное меню должно скрываться за гамбургер", async function () {
        this.browser.setWindowSize(575, 1080);
        await this.browser.url("http://localhost:3000/hw/store");
        await this.browser.assertView("plain", ".navbar-toggler");
    });
});

describe("Страница товара", () => {
    it("кнопка add to cart нужного размера", async function () {
        await this.browser.url("http://localhost:3000/hw/store/catalog/0");
        await this.browser.assertView("plain", ".ProductDetails-AddToCart");
    });
});

describe("Корзина", () => {
    it('для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', async () => {
        const browserInstance = await puppeteer.launch();
        page = await browserInstance.newPage();
        await page.reload();
        await page.goto(`http://localhost:3000/hw/store/catalog/0`);
        await page.waitForSelector(".ProductDetails-AddToCart");
        await page.click(".ProductDetails-AddToCart");
        await page.goto(`http://localhost:3000/hw/store/cart`);
        await page.waitForSelector('.Cart-Index');
        await page.waitForSelector('.Cart-Name');
        await page.waitForSelector('.Cart-Price');
        await page.waitForSelector('.Cart-Total');
        await page.waitForSelector('.Cart-Count');
    });

    it('в  корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
        const browserInstance = await puppeteer.launch();
        page = await browserInstance.newPage();
        await page.reload();
        await page.goto(`http://localhost:3000/hw/store/catalog/0`);
        await page.waitForSelector(".ProductDetails-AddToCart");
        await page.click(".ProductDetails-AddToCart");
        await page.goto(`http://localhost:3000/hw/store/cart`);
        await page.click(".Cart-Clear");
        await page.reload();
        await page.waitForSelector('[data-testid="catalog-cart-link"');
    })
});

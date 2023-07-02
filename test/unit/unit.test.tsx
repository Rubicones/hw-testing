import React from "react";
import configureStore from "redux-mock-store";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";
import { ExampleApi, CartApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { Catalog } from "../../src/client/pages/Catalog";
import { Cart } from "../../src/client/pages/Cart";
import { ProductDetails } from "../../src/client/components/ProductDetails";
import events from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import "@testing-library/jest-dom";

const mock = new MockAdapter(axios);

mock.onAny().reply(200);
describe("Шапка", () => {
    it("в шапке отображаются ссылки на страницы магазина", () => {
        const catalogNames = ["Catalog", "Delivery", "Contacts", "Cart"];

        const basename = "/";
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
        const app = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const { getByTestId } = render(app);
        const navbar = getByTestId("navbar-nav");
        for (let i = 0; i < navbar.children.length; i++) {
            expect(navbar.children[i].innerHTML).toEqual(catalogNames[i]);
        }
    });

    it("название в шапке является ссылкой на главную страницу", () => {
        const basename = "/";
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
        const app = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const { getByTestId } = render(app);
        const brand = getByTestId("navbar-brand");
        expect(brand.tagName).toEqual("A");
        expect(brand.getAttribute("href")).toEqual("/");
    });

    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async () => {
        global.innerWidth = 575;
        const basename = "/";
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
        const app = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const { getByTestId } = render(app);
        const hamburger = getByTestId("navbar-toggler");
        const navbarContainer = getByTestId("navbar-collapse");
        const navbar = getByTestId("navbar-nav");

        await events.click(hamburger);
        await events.click(navbar.children[0]);
        expect(navbarContainer.classList).toContain("collapse");
    });
});

describe("Корзина", () => {
    it("если корзина пустая, должна отображаться ссылка на каталог товаров", async () => {
        const basename = "/";
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);
        const app = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Cart />
                </Provider>
            </BrowserRouter>
        );

        const { getByTestId } = render(app);
        const link = getByTestId("catalog-cart-link");
        expect(link.getAttribute("href")).toEqual("/catalog");
    });
});

describe("Каталог", () => {
    const mockStore = configureStore();
    const store = mockStore({
        products: [
            {
                id: 1,
                name: "Product 1",
                description: "Description 1",
                price: 11,
            },
            {
                id: 2,
                name: "Product 2",
                description: "Description 2",
                price: 12,
            },
        ],
        details: {},
        cart: {},
        latestOrderId: undefined,
    });

    it("должны отображаться товары, список которых приходит с сервера", () => {
        const basename = "/";

        const { container } = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </BrowserRouter>
        );

        const product1 = container.querySelector('.col-12 [data-testid="1"]');
        const product2 = container.querySelector('.col-12 [data-testid="2"]');
        expect(product1).toBeInTheDocument();
        expect(product2).toBeInTheDocument();
    });

    it("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", () => {
        const basename = "/";

        const { getByTestId } = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Catalog />
                </Provider>
            </BrowserRouter>
        );

        const name = getByTestId("name_1").innerHTML;
        const link = getByTestId("link_1").getAttribute("href");
        const price = getByTestId("price_1").innerHTML;

        expect(name).toEqual("Product 1");
        expect(link).toEqual("/catalog/1");
        expect(price).toEqual("$11");
    });
});

describe("Товар", () => {
    const mockProduct = {
        id: 1,
        name: "Test product",
        description: "This is a test product",
        material: "Test material",
        color: "Test color",
        price: 10.0,
    };

    it("на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка добавить в корзину", () => {
        const basename = "/";

        const mockApi = new ExampleApi(basename);
        const mockCart = new CartApi();
        const store = initStore(mockApi, mockCart);

        const { container } = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <ProductDetails product={mockProduct} />
                </Provider>
            </BrowserRouter>
        );

        expect(
            container.querySelector(".ProductDetails-Name")
        ).toHaveTextContent(mockProduct.name);
        expect(
            container.querySelector(".ProductDetails-Description")
        ).toHaveTextContent(mockProduct.description);
        expect(
            container.querySelector(".ProductDetails-Price")
        ).toHaveTextContent("$" + mockProduct.price);
        expect(
            container.querySelector(".ProductDetails-Color")
        ).toHaveTextContent(mockProduct.color);
        expect(
            container.querySelector(".ProductDetails-Material")
        ).toHaveTextContent(mockProduct.material);
        expect(
            container.querySelector(".ProductDetails-AddToCart")
        ).toHaveTextContent("Add to Cart");
    });

    it("один товар добавляется в корзину по клику на кнопку, при повторном клике кол-во увеличивается на 1 ", async () => {
        const basename = "/";

        const mockApi = new ExampleApi(basename);
        const mockCart = new CartApi();
        const store = initStore(mockApi, mockCart);

        const { getByText } = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <ProductDetails product={mockProduct} />
                </Provider>
            </BrowserRouter>
        );

        const button = getByText("Add to Cart");

        await events.click(button);
        await events.click(button);

        expect(localStorage.getItem("example-store-cart")).not.toEqual(
            undefined
        );
        expect(
            JSON.parse(localStorage.getItem("example-store-cart"))["1"]["count"]
        ).toEqual(2);
    });
});

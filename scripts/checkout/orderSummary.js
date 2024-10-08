import {cart, removeFromCart, updateDeliveryOption} from "../../data/cart.js";
import {products, getProduct} from "../../data/products.js";
import {formatPrice} from '../utils/money.js'
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";

//hello()

//Coding date with DayJS
//const today = dayjs();
//const deliverDate = today.add(0, 'days');
//console.log(deliverDate.format('dddd, MMMM D'));

export function renderOrderSummary() {
    let cartSummaryHTML = ''
    cart.forEach((cartItem)=> {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML +=
    `<div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src='${matchingProduct.image}'>

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatPrice(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                    <button
                    style='
                        background-color: green;
                        color: white;
                        font-size: 14px;
                        width: 70px;
                        height: 30px;
                        border: none;
                        border-radius: 20px;
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)'>
                        Update
                      </button>
                </span>
                <span class="delete-quantity-link link-primary
                js-delete-link" data-product-id='${matchingProduct.id}'>
                <button
                style='
                    background-color: rgb(216,0,0);
                    color: white;
                    font-size: 14px;
                    width: 70px;
                    height: 30px;
                    border: none;
                    border-radius: 20px;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)'>
                    Delete
                  </button>
                </span>
            </div>
            </div>
        
            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}            
            </div>
        </div>
        </div>
    `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = [];
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D')

        const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatPrice(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        html +=
        `  <div class="delivery-option js-delivery-option" 
            data-product-id='${matchingProduct.id}'
            data-delivery-option-id='${deliveryOption.id}'>
                <input type="radio" ${isChecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                <div class="delivery-option-date">
                    ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString} Shipping
                </div>
                </div>
            </div>
        `
    });
    return html
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML

document.querySelectorAll('.js-delete-link')
    .forEach((deleteLink)=> {
        deleteLink.addEventListener('click', () => {
            const productId = deleteLink.dataset.productId
            removeFromCart(productId);
            
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`); 
                container.remove()
        });
    })

    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset
                //const productId = productId.element.dataset;
                //const deliveryOptionId = deliveryOptionId.element.dataset;
                updateDeliveryOption(productId, deliveryOptionId)
                renderOrderSummary()
            })
        });
}




import {item_db} from "../db/db.js";
import {ItemModel} from "../model/itemModel.js";


const submit = $('#Item .btn-success').eq(0);
const update = $('#Item .btn-primary').eq(0);
const delete_btn = $('#Item .btn-danger').eq(0);
const reset = $('#Item .btn-warning').eq(0);

const itemCode = $('#item_code');
const itemName = $('#item_name');
const price = $('#price');
const qtyOnHand = $('#QtyOnHand');


const searchBtn = $('#search');
const searchField = $('#searchField');

// Enhanced Validation patterns
const namePattern = /^[\p{L}\s.'-]{3,}$/u; // Allows international characters, min 3 chars
const pricePattern = /^\d+(\.\d{1,2})?$/; // Positive number with optional 2 decimals
const quantityPattern = /^[1-9]\d*$/; // Positive whole number, no leading zeros


// Initialize
$(document).ready(() => {
    itemCode.val(generateItemCode());
    populateItemTable();
});

// Event Listeners
$('#item_page').on('click', () => {
    resetForm();
    populateItemTable();
});

searchField.on('input', () => searchItems());
searchBtn.on('click', () => searchItems());

submit.on('click', (e) => {
    e.preventDefault();
    addItem();
});

update.on('click', () => updateItem());

delete_btn.on('click', () => deleteItem());

reset.on('click', (e) => {
    e.preventDefault();
    resetForm();
});
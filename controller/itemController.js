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

function generateItemCode() {
    if (item_db.length === 0) return 'item-001';

    const highestCode = item_db.reduce((max, item) => {
        const num = parseInt(item.item_code.split('-')[1]);
        return num > max ? num : max;
    }, 0);

    return `item-${String(highestCode + 1).padStart(3, '0')}`;
}
function resetForm() {
    itemCode.val(generateItemCode());
    itemName.val('');
    price.val('');
    qtyOnHand.val('');
    submit.prop("disabled", false);
    delete_btn.prop("disabled", true);
    update.prop("disabled", true);

    // Clear validation states
    $('.is-invalid').removeClass('is-invalid');
    $('.invalid-feedback').remove();
}

function validateForm() {
    let isValid = true;

    // Clear previous validation states
    $('.is-invalid').removeClass('is-invalid');
    $('.invalid-feedback').remove();

    // Item Name validation (required)
    const nameValue = itemName.val().trim();
    if (!nameValue) {
        showFieldError(itemName, "Item name is required");
        isValid = false;
    } else if (!namePattern.test(nameValue)) {
        showFieldError(itemName, "Item name must be at least 3 characters (letters only)");
        isValid = false;
    }

    // Price validation (required)
    const priceValue = price.val().trim();
    if (!priceValue) {
        showFieldError(price, "Price is required");
        isValid = false;
    } else if (!pricePattern.test(priceValue)) {
        showFieldError(price, "Please enter a valid price (positive number with up to 2 decimals)");
        isValid = false;
    } else if (parseFloat(priceValue) <= 0) {
        showFieldError(price, "Price must be greater than 0");
        isValid = false;
    }

    // Quantity validation (required)
    const qtyValue = qtyOnHand.val().trim();
    if (!qtyValue) {
        showFieldError(qtyOnHand, "Quantity is required");
        isValid = false;
    } else if (!quantityPattern.test(qtyValue)) {
        showFieldError(qtyOnHand, "Please enter a valid quantity (positive whole number, no leading zeros)");
        isValid = false;
    }

    return isValid;
}

function showFieldError(field, message) {
    field.addClass('is-invalid');
    field.after(`<div class="invalid-feedback">${message}</div>`);
}

function showError(title, message) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message
    });
}

function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message
    });
}

function addItem() {
    if (!validateForm()) return;

    const item = new ItemModel(
        itemCode.val(),
        itemName.val().trim(),
        parseFloat(price.val().trim()),
        parseInt(qtyOnHand.val().trim(), 10)
    );

    item_db.push(item);
    showSuccess("Item added successfully!");
    populateItemTable();
    resetForm();
}
function updateItem() {
    if (!validateForm()) return;

    const itemId = itemCode.val();
    const index = item_db.findIndex(i => i.item_code === itemId);

    if (index === -1) {
        showError("Error", "Item not found");
        return;
    }

    item_db[index] = new ItemModel(
        itemId,
        itemName.val().trim(),
        parseFloat(price.val().trim()),
        parseInt(qtyOnHand.val().trim(), 10)
    );

    showSuccess("Item updated successfully!");
    populateItemTable();
    resetForm();
}
function deleteItem() {
    const itemId = itemCode.val();

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            const index = item_db.findIndex(i => i.item_code === itemId);
            if (index !== -1) {
                item_db.splice(index, 1);
                showSuccess("Item deleted successfully!");
                populateItemTable();
                resetForm();
            }
        }
    });
}

function searchItems() {
    const searchTerm = searchField.val().toLowerCase();

    const results = item_db.filter(item =>
        item.item_code.toLowerCase().includes(searchTerm) ||
        item.item_name.toLowerCase().includes(searchTerm) ||
        item.price.toString().includes(searchTerm) ||
        item.qty_on_hand.toString().includes(searchTerm)
    );

    renderItemTable(results);
}

function populateItemTable() {
    renderItemTable(item_db);
    $('#total-items').text(item_db.length);
}

function renderItemTable(items) {
    const tbody = $('#itemTable tbody');
    tbody.empty();

    items.forEach(item => {
        tbody.append(`
            <tr>
                <th scope="row">${item.item_code}</th>
                <td>${item.item_name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.qty_on_hand}</td>
            </tr>
        `);
    });

    // Update pagination info if needed
    $('#showingCount').text(items.length);
}
$('#itemTable').on('click', 'tbody tr', function() {
    const cells = $(this).children();
    itemCode.val(cells.eq(0).text());
    itemName.val(cells.eq(1).text());
    price.val(cells.eq(2).text());
    qtyOnHand.val(cells.eq(3).text());

    submit.prop("disabled", true);
    delete_btn.prop("disabled", false);
    update.prop("disabled", false);
});
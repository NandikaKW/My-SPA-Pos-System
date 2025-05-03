
import { customer_db } from "../db/db.js";
import { CustomerModel } from "../model/customerModel.js";

// DOM Elements
const submit = $('#Customer .btn-success').eq(0);
const update = $('#Customer .btn-primary').eq(0);
const delete_btn = $('#Customer .btn-danger').eq(0);
const reset = $('#Customer .btn-warning').eq(0);

// Form fields
const customer_id = $('#customer_id');
const name = $('#customer_name');
const address = $('#address');
const contact = $('#contact');
const email = $('#email');

// Search elements
const searchBtn = $('#searchCustomer').next();
const searchField = $('#searchCustomer');

// Enhanced Validation patterns
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Improved Sri Lankan mobile number regex with better validation
const mobilePattern = /^(?:\+94|0|94|0094)?(7[0-9])(\d{7})$/;
// Name pattern to ensure proper names (allowing international characters)
const namePattern = /^[\p{L}\s.'-]+$/u;
// Address pattern to ensure minimum address quality
const addressPattern = /^[\p{L}0-9\s.,'-]{10,}$/u;

// Initialize
$(document).ready(() => {
    customer_id.val(generateCustomerId());
    populateCustomerTable();
});

// Event Listeners
$('#customer_page').on('click', () => {
    resetForm();
    populateCustomerTable();
});

searchField.on('input', () => searchCustomers());
searchBtn.on('click', () => searchCustomers());

submit.on('click', (e) => {
    e.preventDefault();
    addCustomer();
});

update.on('click', () => updateCustomer());

delete_btn.on('click', () => deleteCustomer());

reset.on('click', (e) => {
    e.preventDefault();
    resetForm();
});

// Functions
function generateCustomerId() {
    if (customer_db.length === 0) return 'cust-001';

    const highestId = customer_db.reduce((max, customer) => {
        const num = parseInt(customer.customer_id.split('-')[1]);
        return num > max ? num : max;
    }, 0);

    return `cust-${String(highestId + 1).padStart(3, '0')}`;
}

function resetForm() {
    customer_id.val(generateCustomerId());
    name.val('');
    address.val('');
    contact.val('');
    email.val('');
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

    // Name validation (required)
    const nameValue = name.val().trim();
    if (!nameValue) {
        showFieldError(name, "Customer name is required");
        isValid = false;
    } else if (!namePattern.test(nameValue)) {
        showFieldError(name, "Please enter a valid name (only letters, spaces, and basic punctuation)");
        isValid = false;
    }

    // Address validation (required)
    const addressValue = address.val().trim();
    if (!addressValue) {
        showFieldError(address, "Address is required");
        isValid = false;
    } else if (!addressPattern.test(addressValue)) {
        showFieldError(address, "Please enter a valid address (minimum 10 characters)");
        isValid = false;
    }

    // Contact validation (required)
    const contactValue = contact.val().trim();
    if (!contactValue) {
        showFieldError(contact, "Contact number is required");
        isValid = false;
    } else if (!mobilePattern.test(contactValue)) {
        showFieldError(contact, "Please enter a valid Sri Lankan mobile number (e.g., 07XXXXXXXX, +947XXXXXXXX, 947XXXXXXXX)");
        isValid = false;
    }

    // Email validation (optional but must be valid if provided)
    const emailValue = email.val().trim();
    if (emailValue && !emailPattern.test(emailValue)) {
        showFieldError(email, "Please enter a valid email address");
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

function addCustomer() {
    if (!validateForm()) return;

    const customer = new CustomerModel(
        customer_id.val(),
        name.val().trim(),
        address.val().trim(),
        contact.val().trim(),
        email.val().trim()
    );

    customer_db.push(customer);
    showSuccess("Customer added successfully!");
    populateCustomerTable();
    $('#customerCount').text(customer_db.length);
    resetForm();
}


function updateCustomer() {
    if (!validateForm()) return;

    const customerId = customer_id.val();
    const index = customer_db.findIndex(c => c.customer_id === customerId);

    if (index === -1) {
        showError("Error", "Customer not found");
        return;
    }

    customer_db[index] = new CustomerModel(
        customerId,
        name.val().trim(),
        address.val().trim(),
        contact.val().trim(),
        email.val().trim()
    );

    showSuccess("Customer updated successfully!");
    populateCustomerTable();
    resetForm();
}

function deleteCustomer() {
    const customerId = customer_id.val();

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
            const index = customer_db.findIndex(c => c.customer_id === customerId);
            if (index !== -1) {
                customer_db.splice(index, 1);
                showSuccess("Customer deleted successfully!");
                populateCustomerTable();
                resetForm();
            }
        }
    });
}

function searchCustomers() {
    const searchTerm = searchField.val().toLowerCase();

    const results = customer_db.filter(customer =>
        customer.customer_id.toLowerCase().includes(searchTerm) ||
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm) ||
        customer.contact.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
    );

    renderCustomerTable(results);
}
function populateCustomerTable() {
    renderCustomerTable(customer_db);
}

function renderCustomerTable(customers) {
    const tbody = $('#customerTable tbody');
    tbody.empty();

    customers.forEach(customer => {
        tbody.append(`
            <tr>
                <th scope="row">${customer.customer_id}</th>
                <td>${customer.name}</td>
                <td>${customer.address}</td>
                <td>${customer.contact}</td>
                <td>${customer.email}</td>
            </tr>
        `);
    });

    // Update pagination info
    $('#showingCount').text(customers.length);
}

$('#customerTable').on('click', 'tbody tr', function () {
    const cells = $(this).children();
    customer_id.val(cells.eq(0).text());
    name.val(cells.eq(1).text());
    address.val(cells.eq(2).text());
    contact.val(cells.eq(3).text());
    email.val(cells.eq(4).text());

    submit.prop("disabled", true);
    delete_btn.prop("disabled", false);
    update.prop("disabled", false);

});


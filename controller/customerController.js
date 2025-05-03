import{customer_db} from "../db/db.js";
import {CustomerModel} from "../model/customerModel.js";

const submit = $('#Customer .btn-success').eq(0);
const update = $('#Customer .btn-primary').eq(0);
const delete_btn = $('#Customer .btn-danger').eq(0);
const reset = $('#Customer .btn-warning').eq(0);

const customer_id = $('#customer_id');
const name = $('#customer_name');
const address = $('#address');
const contact = $('#contact');
const email = $('#email');


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

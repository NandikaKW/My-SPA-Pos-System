import {customer_db, order_db} from "../db/db.js";
import {OrderModel} from "../model/orderModel.js";

import {order_details_db} from "../db/db.js";
import {orderModel} from "../model/orderDetailsModel.js";

let searchField=$('#searchField');

//Order Details search
searchField.on('input', function () {
    let search_term = searchField.val();

    let results = order_db.filter((item) =>

        item.order_date.toLowerCase().startsWith(search_term.toLowerCase()) || item.order_id.toLowerCase().startsWith(search_term.toLowerCase()) ||
        item.customer_id.toLowerCase().startsWith(search_term.toLowerCase())

    );

    $('tbody').eq(3).empty();
    results.map((orderDetails, index) => {
        let tbl_row = `<tr>
                <th scope="row">${orderDetails.order_id}</th>
                <td>${orderDetails.order_date}</td>
                <td>${orderDetails.customer_id}</td>
                <td>${orderDetails.total}</td>
                <td>${orderDetails.discount}</td>
                <td>${calculateSubtotal(orderDetails.total, orderDetails.discount)}</td>
                <td>${orderDetails.cash}</td>
                <td>${calculateBalance(orderDetails.cash, orderDetails.total, orderDetails.discount)}</td>                
            </tr>`;
        $('tbody').eq(3).append(tbl_row);
    });

});

function populateTableOrderDetails() {
    $('tbody').eq(3).empty();
    order_db.map((orderDetails) => {
        $('tbody').eq(3).append(
            `<tr>
                <th scope="row">${orderDetails.order_id}</th>
                <td>${orderDetails.order_date}</td>
                <td>${orderDetails.customer_id}</td>
                <td>${orderDetails.total}</td>
                <td>${orderDetails.discount}</td>
                <td>${calculateSubtotal(orderDetails.total, orderDetails.discount)}</td>
                <td>${orderDetails.cash}</td>
                <td>${calculateBalance(orderDetails.cash, orderDetails.total, orderDetails.discount)}</td>                
            </tr>`
        );
    });
}

function calculateSubtotal(total, discount) {
    const discountValue = parseFloat(discount) || 0;
    const subtotal = total - (total * (discountValue / 100));
    return subtotal.toFixed(2); // Assuming you want two decimal places
}

// Helper function to calculate balance based on cash, total, and discount
function calculateBalance(cash, total, discount) {
    const discountValue = parseFloat(discount) || 0;
    const subtotal = calculateSubtotal(total, discount);
    const balance = cash - parseFloat(subtotal);
    return balance.toFixed(2); // Assuming you want two decimal places
}

$('#order_details_page').on('click', function() {
    populateTableOrderDetails();
    searchField.attr("placeholder", "Search Order Id Here");
});
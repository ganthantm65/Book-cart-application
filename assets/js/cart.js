let user = sessionStorage.getItem("user");
if (user) {
    document.querySelector('.username').textContent = user;
    document.querySelector('.user').textContent = user.charAt(0).toUpperCase();

    let cart = localStorage.getItem('cartitems');
    let cart_book = cart ? JSON.parse(cart) : [];

    let cartdiv = document.querySelector('.cart_items');
    let amounts = [], total = 0;

    for (let i = 0; i < cart_book.length; i++) {
        let element = document.createElement('div');
        element.className = 'cart_books';
        let price = Number(cart_book[i].cart_item.price) * Number(cart_book[i].cart_item.quantity);
        let child = `<h4>${cart_book[i].cart_item.bookname}</h4>
                     <h4>${cart_book[i].cart_item.quantity}</h4>
                     <h4>Rs.${price}</h4>`;
        element.innerHTML = child;
        cartdiv.appendChild(element);
        amounts.push(price);
    }

    console.log(amounts);
    for (let i = 0; i < amounts.length; i++) {
        total += amounts[i];
    }

    let tax = total * 0.05;

    document.querySelector('.cart_total').innerHTML = `<h1>Amount: Rs.${total}</h1>`;

    document.querySelector('.remove').addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    });

    document.querySelector('.continue').addEventListener("click", () => {
        window.location.href = 'http://localhost/library/main.html';
    });

    document.querySelector('.cart_bill').innerHTML = `<h3>Amount   : Rs.${total}</h3>
                                                      <h3>Tax      : Rs.${tax.toFixed(2)}</h3>
                                                      <h2>Total    : Rs.${(total + tax).toFixed(2)}</h2>
                                                      <button onclick="
                                                      alert('Your order has been sent')
                                                      ">Buy</button>`;

    const searchData = async (product) => {
        try {
            const header = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ element: product }),
            };

            const response = await fetch("http://localhost/library/server/search.php", header);

            if (!response.ok) {
                throw new Error("Failed to fetch data from server.");
            }

            const result = await response.text();

            try {
                const data = JSON.parse(result);

                if (data.success) {
                    window.location.href = "http://localhost/library/search.html";
                    alert("Books found: " + JSON.stringify(data.response));
                    sessionStorage.setItem('search-response', JSON.stringify(data.response));
                } else {
                    alert(data.message);
                }
            } catch (e) {
                console.error("Error parsing JSON: ", e);
                alert("Failed to parse the server response as JSON.");
            }
        } catch (e) {
            alert("Failed to fetch data from the server.");
        }
    };

    document.querySelector('.search-btn').addEventListener('click', () => {
        const searchValue = document.querySelector('.search').value;
        if (searchValue) {
            searchData(searchValue);
        }
    });

    document.querySelector('.search').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchValue = document.querySelector('.search').value;
            if (searchValue) {
                searchData(searchValue);
            }
        }
    });

} else {
    window.location.href = 'http://localhost/library/login.html';
}

let heading = document.querySelector(".heading");
let user = sessionStorage.getItem("user");

if (user) {
    let parent_divs = ["biography", "programming", "comic", "fiction"];
    let cartitems = JSON.parse(localStorage.getItem('cartitems')) || [];
    let cartno;
    const getData = async (genre, div) => {
        try {
            let header = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ genre: genre }),
            };

            let response = await fetch("http://localhost/library/server/products.php", header);
            if (!response.ok) {
                throw new Error("Data is not fetched");
            } else {
                let result = await response.text();
                let data;
                try {
                    data = JSON.parse(result);

                    if (data.success) {
                        let element = "";
                        for (let i = 0; i < data.response.length; i++) {
                            let child = `<div class="books">
                                            <img src="${data.response[i].image}" height="280px"></img>
                                            <p>${data.response[i].bookname}</p>
                                            <p>Rs.${data.response[i].price}</p>
                                            <h5>${data.response[i].description}</h5>
                                            <h5>${data.response[i].author}</h5>
                                            <h5>${data.response[i].publication}</h5>
                                            <input type="number" class="count" min="1" value="1">
                                            <button class="adder">Add to cart</button>
                                         </div>`;
                            element += child;
                        }
                        div.innerHTML = element;
                    } else {
                        alert(data.message);
                    }
                } catch (e) {
                    console.error("Error parsing JSON: ", e);
                    alert("Failed to parse the server response as JSON.");
                }
            }
        } catch (error) {
            alert(error);
        }
    };

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

    heading.textContent = `Welcome ${user}`;
    document.querySelector('.username').textContent = user;
    document.querySelector('.user').textContent = user[0].split(1, -1);
    document.querySelector('.logout').addEventListener("click", () => {
        sessionStorage.clear();
        localStorage.removeItem('cartitems');
        window.location.href = 'http://localhost/library';
    });

    document.querySelector('.search-btn').addEventListener('click', (event) => {
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

    for (let i = 0; i < parent_divs.length; i++) {
        getData(
            document.querySelector(`.genre-${i + 1}`).textContent,
            document.querySelector(`.${parent_divs[i]}`)
        );
    }

    document.querySelectorAll('.body').forEach((book) => {
        book.addEventListener("click", (event) => {
            if (event.target.className === 'books' || event.target.className !== 'adder') {
                let content = [];
                if (event.target.className === 'books') {
                    content = event.target.textContent.split("\n");
                    content = content.map(i => i.trim("\t")).filter(i => i !== "");
                    let [bookname, price, description, author, publication] = content;
    
                    document.querySelector('.popup-image').src = event.target.childNodes[1].src;
                    let container = document.querySelector('.popup-content');
                    container.querySelector('h1').textContent = bookname;
                    container.querySelector('h2').textContent = price;
                    container.querySelector('h3').textContent = author;
                    container.querySelector('h4').textContent = publication;
                    container.querySelector('h5').textContent = description;
    
                    document.querySelector('.popup').style.display = 'flex';
                }
            } else if (event.target.className === 'adder') {
                const bookElement = event.target.parentElement;
                const bookname = bookElement.querySelector('p:nth-child(2)').textContent;
                const price = bookElement.querySelector('p:nth-child(3)').textContent.replace('Rs.', '');
                const description = bookElement.querySelector('h5:nth-child(4)').textContent;
                const author = bookElement.querySelector('h5:nth-child(5)').textContent;
                const publication = bookElement.querySelector('h5:nth-child(6)').textContent;
                const quantity = bookElement.querySelector('.count').value;
    
                if (quantity <= 0 || isNaN(quantity)) {
                    alert('Please provide a valid quantity');
                    return;
                }
    
                const book = { bookname, price, description, author, publication, quantity };
                let cartitems = JSON.parse(sessionStorage.getItem('cartitems')) || [];
    
                let existingBook = cartitems.find(item => item.cart_item.bookname === bookname);
                if (existingBook) {
                    existingBook.cart_item.quantity = (parseInt(existingBook.cart_item.quantity) + parseInt(quantity)).toString();
                } else {
                    const cart = {
                        cartno: cartitems.length + 1,
                        cart_item: book
                    };
                    cartitems.push(cart);
                }
    
                sessionStorage.setItem('cartitems', JSON.stringify(cartitems));
                alert('Book added to the cart!');
            }
        });
    });
    
    document.querySelector('.close-popup').addEventListener('click', () => {
        document.querySelector('.popup').style.display = 'none';
    });
    

    document.querySelector('.close-popup').addEventListener('click', () => {
        document.querySelector('.popup').style.display = 'none';
    });

} else {
    window.location.href = 'http://localhost/library/login.html';
}

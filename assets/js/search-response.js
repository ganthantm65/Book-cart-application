let user = sessionStorage.getItem("user");
let response=sessionStorage.getItem('search-response')
if (user) {
    response=JSON.parse(response)
    console.log(response[0].image);
    
    document.querySelector('.username').innerHTML = user;
    document.querySelector('.user').textContent = user[0];
    document.querySelector('.logout').addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = 'http://localhost/library';
    });
    let searchContent=document.querySelector('.search-content');
    let div=document.createElement('div');
    div.className="search-books";
    div.innerHTML='<p>Results:</p>'
    let elements=``
    for (let index = 0; index < response.length; index++) {
        let child=`<div class='search-item'>
                        <img src=${response[index].image} width="250px">
                        <div>
                            <p>Product ID:${response[index].bookname}</p>
                            <p>Book Name:${response[index].bookname}</p>
                            <p>Genre:${response[index].genre}</p>
                            <p>Author:${response[0].author}</p>
                            <p>Price:${response[0].price}</p>
                        </div>
                   </div>`;
        elements+=child;
    }
    div.innerHTML=elements;
    searchContent.appendChild(div);

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
                    sessionStorage.setItem('search-response',JSON.stringify(data.response));
                   
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
    document.querySelector('.search-btn').addEventListener('click', (event) => {
        console.log('clicked');
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

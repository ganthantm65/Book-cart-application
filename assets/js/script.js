class Data {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

class Form_Data extends Data {
    constructor(user, email, password, phone) {
        super(email, password);
        this.user = user;
        this.phone = Number(phone);
    }
}

let header;
let form1 = document.querySelector(".form1");
let form2 = document.querySelector(".form2");

form1.addEventListener("submit", (event) => {
    event.preventDefault();
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    const data = new Data(email, password);
    header = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(data)
    };
    validateData(header);
});

form2.addEventListener("submit", (event) => {
    let user = document.querySelector(".user").value;
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;
    let phone = document.querySelector(".phone").value;

    if (phone.length >= 10 && !isNaN(phone) && password != "" && email != "" && user != "") {
        const data = new Form_Data(user, email, password, phone);
        header = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        };
        sendData(header);
    } else {
        alert('Please provide valid data');
    }
});

const validateData = async (header) => {
    try {
        const response = await fetch("server/login.php", header);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        if (result.success) {
            window.location.href = "http://localhost/library/main.html";
            sessionStorage.setItem("user",result.user)
            sessionStorage.setItem('cart',result.cartno)
        } else {
            alert(result);
            console.log(result.message);
        }
    } catch (error) {
        alert("Error in log in");
    }
};

const sendData = async (header) => {
    try {
        const response = await fetch("server/register.php", header);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
            window.location.href = "http://localhost/library/main.html";
            sessionStorage.setItem("user",result.user)
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Error:", error);
    }
};

document.querySelector(".link-1").addEventListener('click', (event) => {
    event.preventDefault();
    form1.style.display = 'none';
    form2.style.display = 'flex';
    document.title = "Registration Form";
});

document.querySelector(".link-2").addEventListener('click', (event) => {
    event.preventDefault();
    form1.style.display = 'flex';
    form2.style.display = 'none';
});

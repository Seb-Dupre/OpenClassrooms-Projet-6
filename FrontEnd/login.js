
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const errorMessage = document.querySelector(".login p");


async function login(login, pass) {
    try {
        const response = await fetch("http://localhost:5678/api/users/login",{method:"post", body:JSON.stringify({email:login, password:pass}),headers: {
            "Content-Type": "application/json",
          }
    });
        return await response;
    }
    
    catch (error) {
        console.log("ERROR")
    } 
    console.log(response)
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const response = await login(email.value , password.value)
    console.log(response.status)

    
    if (response.status === 200){

        const json = await response.json(); 
        localStorage.setItem("token", json.token);
        window.localStorage.loged = true;
        window.location.href = "index.html";
    }
    else{
        errorMessage.textContent ='email ou mot de passe est incorrect. '
    }
})
/*login email and pwd : "sophie.bluel@test.tld" , "S0phie" */ 

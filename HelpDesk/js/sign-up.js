document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    if (password !== confirm_password) {
        alert("As senhas não correspondem. Por favor, verifique.");
        return;
    }

    const formData = {
        name: name,
        email: email,
        password: password
    };

    const url = "http://localhost:3000/signup";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do servidor:", data);
            alert("Usuário registrado com sucesso!");
            window.location.href = "sign-in.html";
        })
        .catch(error => {
            console.error("Erro ao registrar usuário:", error);
            alert("Erro ao registrar usuário. Por favor, tente novamente.");
        });
});

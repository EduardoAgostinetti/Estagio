document.getElementById("signinForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer login. Por favor, verifique suas credenciais e tente novamente.');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            console.log("Resposta do servidor:", data);

            localStorage.setItem('userData', JSON.stringify(data));

            window.location.href = "panel.html";
        })
        .catch(error => {
            console.error("Erro ao fazer login:", error.message);
            alert(error.message);
        });
});

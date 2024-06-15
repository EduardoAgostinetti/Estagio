function gerarCodigo() {
  var codigo = '';
  var caracteres = '0123456789'; // Caracteres permitidos no código
  
  // Gera um código de 8 dígitos
  for (var i = 0; i < 8; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  return codigo;
}


document.addEventListener('DOMContentLoaded', function() {
  // Adiciona um ouvinte de evento para o formulário de recuperação
  document.getElementById('recoveryForm').addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        const emailDestino = document.getElementById('emailrecovery').value;
        const code = gerarCodigo();
        
        const url = "http://localhost:3000/enviar-email";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destinatario: emailDestino,
                code: code
            })
        });

        // Verifica o status da resposta
        if (response.ok) {
            const message = await response.text();
            console.log("Resposta do servidor:", message);
            alert("E-mail enviado com sucesso!");
            // Redirecionar para outra página
            window.location.href = "http://localhost/HelpDesk/pages/recovery-code.html";

        } else {
            throw new Error('Erro ao enviar e-mail');
        }
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error.message);
        alert("Erro ao enviar E-mail, por favor, tente novamente.");
    }
});
  
});
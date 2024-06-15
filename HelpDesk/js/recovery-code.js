
  
  document.addEventListener('DOMContentLoaded', function() {
    // Adiciona um ouvinte de evento para o formulário de recuperação
  
  document.getElementById('recoveryCodeForm').addEventListener("submit", async function (event){
    event.preventDefault();
  
    try {
      const email = document.getElementById('emailcoderecovery').value;
      const senha = document.getElementById('senhacoderecovery').value;
      const confirmar_senha = document.getElementById('confirmar_senhacoderecovery').value;
      const code = document.getElementById('codecoderecovery').value;
  
      if(senha == confirmar_senha){
  
        const url = "http://localhost:3000/alterar-senha";
  
      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              email: email,
              senha: senha,
              code: code
          })
      });
      // Verifica o status da resposta
      if (response.ok) {
        const message = await response.text();
        console.log("Resposta do servidor:", message);
    
        // Converter a resposta em um objeto JSON
        const jsonResponse = JSON.parse(message);
    
        // Acessar a propriedade 'results' do objeto JSON
        const results = jsonResponse.results;
    
        if (results) {
            // Em seguida, acesse a propriedade 'affectedRows' dentro de 'results'
            const affectedRows = results.affectedRows;

            if(affectedRows > 0){
                alert("Senha alterada com sucesso, realize o login.");
                window.location.href = "http://localhost/HelpDesk/pages/sign-in.html";
            }else{
                alert("Não foi possivel alterar a senha, revise os dados e tente novamente.");
            }
           
        } else {
            alert("Erro ao alterar a senha, tente novamente mais tarde!");
        }
    
        alert(Rows);
    }
    else {
          throw new Error('Erro ao enviar e-mail');
      }
        
      }else{
        alert("Senha não correspondem!");
      }
      
      
      
  } catch (error) {
      console.error("Erro ao enviar e-mail:", error.message);
  }
  
  });
    
  });
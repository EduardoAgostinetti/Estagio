document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log(userData);



    if (userData) {
        const userName = document.getElementById('userName');
        const buttonOne = document.getElementById('buttonOne');
        const buttonTwo = document.getElementById('buttonTwo');
        const buttonThree = document.getElementById('buttonThree');
        const buttonFour = document.getElementById('buttonFour');
        const contentOne = document.getElementById('contentOne');
        const contentTwo = document.getElementById('contentTwo');
        const contentThree = document.getElementById('contentThree');
        const contentFour = document.getElementById('contentFour');
        const divrelatorio = document.getElementById('divrelatorio');
        const divfiltro = document.getElementById('divfiltro');

        const url = "http://localhost:3000/recentes";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            })
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log("Resposta do servidor:", data);
                createTicketElements(data.tickets)
            })
            .catch(error => {
                console.error("Erro ao procurar os chamados:", error.message);
            });

        userName.textContent = userData.user.name;
        contentOne.style.display = 'none';
        contentTwo.style.display = 'block';
        contentThree.style.display = 'none';
        divrelatorio.style.display = 'none';
        divfiltro.style.display = 'block';

        document.getElementById('buttonOne').addEventListener('click', function () {
            contentOne.style.display = 'block';
            contentTwo.style.display = 'none';
            contentThree.style.display = 'none';
            divrelatorio.style.display = 'none';
            divfiltro.style.display = 'none';
        });

        document.getElementById('buttonTwo').addEventListener('click', function () {
            contentOne.style.display = 'none';
            contentTwo.style.display = 'block';
            contentThree.style.display = 'none';
            divrelatorio.style.display = 'none';
            divfiltro.style.display = 'block';

            const url = "http://localhost:3000/recentes";

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                })
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log("Resposta do servidor:", data);
                    createTicketElements(data.tickets)

                })
                .catch(error => {
                    console.error("Erro ao procurar os chamados:", error.message);
                });



        });

        document.getElementById('buttonThree').addEventListener('click', function () {
            contentOne.style.display = 'none';
            contentTwo.style.display = 'none';
            contentThree.style.display = 'block';
            divrelatorio.style.display = 'none';
            divfiltro.style.display = 'none';
        });

        document.getElementById('buttonFour').addEventListener('click', function () {
            contentOne.style.display = 'none';
            contentTwo.style.display = 'none';
            contentThree.style.display = 'none';
            divrelatorio.style.display = 'block';
            divfiltro.style.display = 'none';
        });


        if (userData.user.tipo == 0) {
            buttonOne.remove();
        }
        else if (userData.user.tipo == 1) {

            buttonOne.remove();
            buttonThree.remove();
            buttonFour.remove();

        }
        else if (userData.user.tipo == 2) {
            buttonThree.remove();
            buttonFour.remove();
        }


    } else {
        window.location.href = "sign-in.html";
    }
});


document.getElementById('taskForm').addEventListener("submit", function (event) {
    event.preventDefault();

    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log("userData:", userData);

    const requesterid = userData.user.idusers;
    const local = document.getElementById("local").value;
    const priority = document.getElementById("priority").value;
    const task = document.getElementById("task").value;
    const comments = document.getElementById("comments").value;


    if (!task) {
        alert("Por favor, preencha o campo da Terefa");
        return;
    }

    const url = "http://localhost:3000/newTicket";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            requesterid: requesterid,
            local: local,
            priority: priority,
            task: task,
            comments: comments
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            alert("Chamado Criado com sucesso!");
            contentOne.style.display = 'none';
            contentTwo.style.display = 'block';
            contentThree.style.display = 'none';
            divrelatorio.style.display = 'none';
            divfiltro.style.display = 'none';
            RecentesTickets();
            
    document.getElementById("local").value = "";
     document.getElementById("priority").value = "";
     document.getElementById("task").value = "";
     document.getElementById("comments").value = "";
            
        })
        .catch(error => {
            console.error("Erro ao registrar chamado:", error.message);
            alert("Erro ao registrar chamado. Por favor, tente novamente.");
        });

});

function createTicketElements(tickets) {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const contentTwo = document.getElementById('contentTwo');

    while (contentTwo.firstChild) {
        contentTwo.removeChild(contentTwo.firstChild);
    }

    tickets.forEach(ticket => {

        const taskCard = document.createElement('div');
        taskCard.classList.add('taskCard');


        taskCard.innerHTML = `
            <div id="taskCard">
                <div id="infoCard-left">
                    <p id="requesternameticket">Solicitante: ${ticket.requester_name}</p>
                    <p id="localticket">Local: ${ticket.local}</p>
                    <p id="priorityticket">Prioridade: ${ticket.priority}</p>
                    <p id="taskticket">Tarefa: ${ticket.task}</p>
                    <p id="commentsticket">Observações: ${ticket.comments}</p>
                </div>
                <div id="infoCard-right">
                    <p id="idticket">Ticket Id: ${ticket.idtickets}</p>
                    <p id="dateticket">Aberto em: ${ticket.date}</p>
                    <p id="statusticket">Status: ${ticket.status}</p>
                    <p id="commentsemployeeticket">Comentario do Atendimento: ${ticket.comments_employee == null ? `Sem comentarios`: ticket.comments_employee}</p>

                    ${userData.user.tipo == 0 || userData.user.tipo == 1 ? `
                    ${ticket.statusid == 0 ? `
                    
                    <div class="row">
                        <button type="submit" id="employee-verify" class="icon-button"><i class="fa fa-headset"></i></button>
                        
                        
                    </div>
                    ` : ''}
                    ${ticket.statusid == 1 ? `
                    <textarea class="comments-employee" name="comments-employee" rows="7" cols="40" maxlength="255"></textarea>
                    <div class="row">
                        <button type="submit" id="employee-comments" class="icon-button"><i class="fas fa-comment"></i></button>
                        
                    </div>
                    ` : ''}
                    ${ticket.statusid == 3 ? `
                    
                    ` : ''}

                   
                    
                    ` : ''}

                   
                </div>
            </div>
            <hr>
        `;


        contentTwo.appendChild(taskCard);


        function FinalizadoTicket(){
            const idticket = ticket.idtickets;
                const iduser = userData.user.name;
                const url = "http://localhost:3000/endTicket";

                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idticket: idticket,
                        iduser: iduser
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Resposta do servidor:", data);
                        alert("Ticket Finalizado!");
                        RecentesTickets();
                    })
                    .catch(error => {
                        console.error("Erro ao finalizar o ticket:", error);
                        alert("Erro ao finalizar o ticket. Por favor, tente novamente.");
                    });
                RecentesTickets();
        }
                


        const employeeCommentButton = taskCard.querySelector('#employee-comments');
        if (employeeCommentButton) {
            employeeCommentButton.addEventListener('click', (event) => {

                const taskCard = event.target.closest('.taskCard');
                const comments_employee = taskCard.querySelector('.comments-employee').value;
                const idticket = ticket.idtickets;

                const url = "http://localhost:3000/commentsEmployee";

                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idticket: idticket,
                        comments_employee: comments_employee
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Resposta do servidor:", data);
                        alert("Comentario Enviado!");
                        FinalizadoTicket();
                    })
                    .catch(error => {
                        console.error("Erro ao enviar o comentario:", error);
                        alert("Erro ao enviar o comentario. Por favor, tente novamente.");
                    });
                RecentesTickets();
            });
        }

        const employeeVerifyButton = taskCard.querySelector('#employee-verify');
        if (employeeVerifyButton) {
            employeeVerifyButton.addEventListener('click', () => {

                const iduser = userData.user.name;
                const idticket = ticket.idtickets;

                const url = "http://localhost:3000/statusTicket";

                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idticket: idticket,
                        iduser: iduser
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Resposta do servidor:", data);
                        alert("Atendimento Enviado!");
                        RecentesTickets();
                    })
                    .catch(error => {
                        console.error("Erro ao enviar o Atendimento:", error);
                        alert("Erro ao enviar o Atendimento. Por favor, tente novamente.");
                    });
                RecentesTickets();
            });
        }
    });
}

document.getElementById("newEmployee").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name_employee").value;
    const email = document.getElementById("email_employee").value;
    const password = document.getElementById("password_employee").value;
    const confirm_password = document.getElementById("confirm_password_employee").value;

    if (password !== confirm_password) {
        alert("As senhas não correspondem. Por favor, verifique.");
        return;
    }

    const formData = {
        name: name,
        email: email,
        password: password
    };

    const url = "http://localhost:3000/newEmployee";

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
            alert("Funcionario registrado com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao registrar usuário:", error);
            alert("Erro ao registrar usuário. Por favor, tente novamente.");
        });
});



document.getElementById("formrelatorio").addEventListener("submit", function (event) {
    event.preventDefault();
            contentOne.style.display = 'none';
            contentTwo.style.display = 'none';
            contentThree.style.display = 'none';
            divrelatorio.style.display = 'block';
            divfiltro.style.display = 'none';

    const ano = document.getElementById("ano").value;
    const mes = document.getElementById("mes").value;
    GerarRelatorio(mes, ano);

});

function GerarRelatorio(mes, ano){
    const url = "http://localhost:3000/relatorio";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mes: mes,
            ano: ano
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            createRelatorio(data.tickets);
        })
        .catch(error => {
            console.error("Erro ao procurar os chamados:", error.message);
        });
}


function createRelatorio(tickets) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const contentFour = document.getElementById('contentFour');

    while (contentFour.firstChild) {
        contentFour.removeChild(contentFour.firstChild);
    }

    

    tickets.forEach(ticket => {

        const taskCard = document.createElement('div');
        taskCard.classList.add('taskCard');


        taskCard.innerHTML = ` 

            <p>${ticket.date} - ${ticket.requester_name} (${ticket.local}). ${ticket.task}, ${ticket.comments}. ${ticket.comments_employee}</p>
            
            <hr>
        `;


        contentFour.appendChild(taskCard);
        
        
    });
}

function RecentesTickets() {
    const url = "http://localhost:3000/recentes";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            createTicketElements(data.tickets)

        })
        .catch(error => {
            console.error("Erro ao procurar os chamados:", error.message);
        });
}

function AntigosTickets() {
    const url = "http://localhost:3000/antigos";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            createTicketElements(data.tickets)

        })
        .catch(error => {
            console.error("Erro ao procurar os chamados:", error.message);
        });
}

function AbertosTickets() {
    const url = "http://localhost:3000/abertos";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            createTicketElements(data.tickets)

        })
        .catch(error => {
            console.error("Erro ao procurar os chamados:", error.message);
        });
}

function PrioridadeTickets() {
    const url = "http://localhost:3000/prioridade";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            createTicketElements(data.tickets)

        })
        .catch(error => {
            console.error("Erro ao procurar os chamados:", error.message);
        });
}

function FechadosTickets() {
    const url = "http://localhost:3000/fechados";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            createTicketElements(data.tickets)

        })
        .catch(error => {
            console.error("Erro ao procurar os chamados:", error.message);
        });
}

function TodosTickets() {
    const url = "http://localhost:3000/todos";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Resposta do servidor:", data);
            createTicketElements(data.tickets)

        })
        .catch(error => {
            console.error("Erro ao procurar os chamados:", error.message);
        });
}


function filtroSelecionado() {
    var selectBox = document.getElementById("filtros");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    switch(selectedValue) {
        case "1":
            console.log("Chamados Recentes selecionados");
            RecentesTickets();
            break;
        case "2":
            console.log("Chamados Antigos selecionados");
            AntigosTickets();
            break;
        case "3":
            console.log("Prioridade do Chamado selecionada");
            PrioridadeTickets();
            break;
        case "4":
            console.log("Chamados Abertos selecionados");
            AbertosTickets();
            break;
        case "5":
            console.log("Chamados Fechados selecionados");
            FechadosTickets();
            break;
        case "6":
            console.log("Todos os Chamados selecionados");
            TodosTickets();
            break;
        default:
            console.log("Opção inválida selecionada");
            // Caso o valor selecionado não corresponda a nenhum dos casos anteriores
            break;
    }
}
const CryptoJS = require("crypto-js");
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');
const cors = require('cors');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = CryptoJS.SHA256(password).toString();

  const INSERT_USER_QUERY = 'INSERT INTO users (name, email, password, tipo) VALUES (?, ?, ?, 2)';

  connection.query(INSERT_USER_QUERY, [name, email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar usuário:', err);
      return res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }

    console.log('Usuário adicionado com sucesso:', results);
    res.status(200).json({ message: 'Usuário adicionado com sucesso', user: results });
  });

});

app.post('/signin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = CryptoJS.SHA256(password).toString();

  const SELECT_USER_QUERY = 'SELECT * FROM users WHERE email = ? AND password = ?';

  connection.query(SELECT_USER_QUERY, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = results[0];
    console.log('Usuário autenticado com sucesso:', user);
    res.status(200).json({ message: 'Login bem-sucedido', user: user });
  });
});

app.post('/newTicket', (req, res) => {
  const requesterid = req.body.requesterid;
  const local = req.body.local;
  const priority = req.body.priority;
  const task = req.body.task;
  const comments = req.body.comments;

  const INSERT_TICKET_QUERY = 'INSERT INTO tickets (requesterid, local, priority, task, comments, status, date, statusid) VALUES (?, ?, ?, ?, ?,"Em espera", CURRENT_TIMESTAMP, 0)';

  connection.query(INSERT_TICKET_QUERY, [requesterid, local, priority, task, comments], (err, results) => {
    if (err) {
      console.error('Erro ao criar chamado:', err);
      return res.status(500).json({ error: 'Erro ao criar chamado:' });
    }

    console.log('Chamado criado com sucesso:', results);
    res.status(200).json({ message: 'Chamado criado com sucesso:', ticket: results });
  });

});

app.post('/recentes', (req, res) => {
  const SELECT_TICKETS_QUERY = `
  SELECT tickets.*, users.name as requester_name
  FROM tickets
  INNER JOIN users ON tickets.requesterid = users.idusers
  ORDER BY tickets.date DESC
`;

  connection.query(SELECT_TICKETS_QUERY, (err, results) => {
    if (err) {
      console.error('Erro ao buscar tickets:', err);
      return res.status(500).json({ error: 'Erro ao buscar tickets' });
    }

    console.log('Tickets encontrados:', results);
    res.status(200).json({ tickets: results });
  });
});

app.post('/antigos', (req, res) => {
  const SELECT_TICKETS_QUERY = `
  SELECT tickets.*, users.name as requester_name
  FROM tickets
  INNER JOIN users ON tickets.requesterid = users.idusers
  ORDER BY tickets.date ASC
`;

  connection.query(SELECT_TICKETS_QUERY, (err, results) => {
    if (err) {
      console.error('Erro ao buscar tickets:', err);
      return res.status(500).json({ error: 'Erro ao buscar tickets' });
    }

    console.log('Tickets encontrados:', results);
    res.status(200).json({ tickets: results });
  });
});

app.post('/abertos', (req, res) => {
  const SELECT_TICKETS_QUERY = `
  SELECT tickets.*, users.name as requester_name
  FROM tickets
  INNER JOIN users ON tickets.requesterid = users.idusers
  WHERE tickets.status != 'finalizado'
  ORDER BY tickets.date DESC
`;

  connection.query(SELECT_TICKETS_QUERY, (err, results) => {
    if (err) {
      console.error('Erro ao buscar tickets:', err);
      return res.status(500).json({ error: 'Erro ao buscar tickets' });
    }

    console.log('Tickets encontrados:', results);
    res.status(200).json({ tickets: results });
  });
});

app.post('/prioridade', (req, res) => {
  const SELECT_TICKETS_QUERY = `
  SELECT tickets.*, users.name as requester_name
    FROM tickets
    INNER JOIN users ON tickets.requesterid = users.idusers
    WHERE tickets.status != 'finalizado'
    ORDER BY 
      CASE 
        WHEN tickets.priority = 'alta' THEN 1
        WHEN tickets.priority = 'media' THEN 2
        WHEN tickets.priority = 'baixa' THEN 3
      END ASC
`;

  connection.query(SELECT_TICKETS_QUERY, (err, results) => {
    if (err) {
      console.error('Erro ao buscar tickets:', err);
      return res.status(500).json({ error: 'Erro ao buscar tickets' });
    }

    console.log('Tickets encontrados:', results);
    res.status(200).json({ tickets: results });
  });
});

app.post('/fechados', (req, res) => {
  const SELECT_TICKETS_QUERY = `
  SELECT tickets.*, users.name as requester_name
  FROM tickets
  INNER JOIN users ON tickets.requesterid = users.idusers
  WHERE tickets.status = 'finalizado'
  ORDER BY tickets.date DESC
`;

  connection.query(SELECT_TICKETS_QUERY, (err, results) => {
    if (err) {
      console.error('Erro ao buscar tickets:', err);
      return res.status(500).json({ error: 'Erro ao buscar tickets' });
    }

    console.log('Tickets encontrados:', results);
    res.status(200).json({ tickets: results });
  });
});

app.post('/todos', (req, res) => {
  const SELECT_TICKETS_QUERY = `
  SELECT tickets.*, users.name as requester_name
  FROM tickets
  INNER JOIN users ON tickets.requesterid = users.idusers
  ORDER BY tickets.date DESC
`;

  connection.query(SELECT_TICKETS_QUERY, (err, results) => {
    if (err) {
      console.error('Erro ao buscar tickets:', err);
      return res.status(500).json({ error: 'Erro ao buscar tickets' });
    }

    console.log('Tickets encontrados:', results);
    res.status(200).json({ tickets: results });
  });
});

app.post('/newEmployee', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = CryptoJS.SHA256(password).toString();

  const INSERT_USER_QUERY = 'INSERT INTO users (name, email, password, tipo) VALUES (?, ?, ?, 1)';

  connection.query(INSERT_USER_QUERY, [name, email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar usuário:', err);
      return res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }

    console.log('Usuário adicionado com sucesso:', results);
    res.status(200).json({ message: 'Usuário adicionado com sucesso', user: results });
  });

});

app.post('/endTicket', (req, res) => {
  const idticket = req.body.idticket;
  const iduser = "finalizado";


  const UPDATE_TICKET_QUERY = 'UPDATE tickets SET status = ?, statusid = 3 WHERE (idtickets = ?);';

  connection.query(UPDATE_TICKET_QUERY, [iduser, idticket], (err, results) => {
    if (err) {
      console.error('Erro ao finalizar chamado:', err);
      return res.status(500).json({ error: 'Erro ao finalizar chamado:' });
    }

    console.log('Chamado finalizado com sucesso:', results);
    res.status(200).json({ message: 'Chamado finalizado com sucesso:', ticket: results });
  });

});

app.post('/commentsEmployee', (req, res) => {
  const idticket = req.body.idticket;
  const comments_employee = req.body.comments_employee;


  const UPDATE_TICKET_QUERY = 'UPDATE tickets SET comments_employee = ?, statusid = 2 WHERE (idtickets = ?);';

  connection.query(UPDATE_TICKET_QUERY, [comments_employee, idticket], (err, results) => {
    if (err) {
      console.error('Erro ao enviar comentario:', err);
      return res.status(500).json({ error: 'Erro ao enviar comentario:' });
    }

    console.log('comentario criado com sucesso:', results);
    res.status(200).json({ message: 'comentario enviado com sucesso:', ticket: results });
  });

});

app.post('/statusTicket', (req, res) => {
  const idticket = req.body.idticket;
  const status = "Em atendimento por " + req.body.iduser;



  const UPDATE_TICKET_QUERY = 'UPDATE tickets SET status = ?, statusid = 1 WHERE (idtickets = ?);';

  connection.query(UPDATE_TICKET_QUERY, [status, idticket], (err, results) => {
    if (err) {
      console.error('Erro ao enviar atendimento:', err);
      return res.status(500).json({ error: 'Erro ao enviar atendimento:' });
    }

    console.log('Atendimento criado com sucesso:', results);
    res.status(200).json({ message: 'Atendimento enviado com sucesso:', ticket: results });
  });

});

app.post('/relatorio', (req, res) => {

  const mes = req.body.mes;
  const ano = req.body.ano;


  const SELECT_TICKETS_QUERY = `
  SELECT tickets.*, users.name AS requester_name
  FROM tickets
  INNER JOIN users ON tickets.requesterid = users.idusers
  WHERE YEAR(tickets.date) = ?
  AND MONTH(tickets.date) = ?
  ORDER BY tickets.date DESC;

`;

  connection.query(SELECT_TICKETS_QUERY, [ano, mes], (err, results) => {
    if (err) {
      console.error('Erro ao buscar tickets:', err);
      return res.status(500).json({ error: 'Erro ao buscar tickets' });
    }

    console.log('Tickets encontrados:', results);
    res.status(200).json({ tickets: results });
  });
});

// Configuração do transporte
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'duducom195@gmail.com',
      pass: 'pnpx cjji ekgu jpdc'
  }
});

// Rota para enviar e-mail
app.post('/enviar-email', (req, res) => {

  const destinatario = req.body.destinatario;
  const code = req.body.code;

  // Definição do email
  let mailOptions = {
      from: 'Help Desk',
      to: destinatario,
      subject: "Redefinição de Senha",
      text: "Codigo para redefinição: " + code
  };

  // Enviar o e-mail
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
          res.status(500).send('Erro ao enviar e-mail');
      } else {
          
          const UPDATE_TICKET_QUERY = 'UPDATE users SET code = ? WHERE (email = ?);';
          connection.query(UPDATE_TICKET_QUERY, [code, destinatario], (err, results) => {
            if (err) {
              console.error('Erro ao enviar e-mail:', err);
              return res.status(500).json({ error: 'Erro ao enviar e-mail:' });
            }
            console.log('E-mail enviado: ' + info.response);
            res.send('E-mail enviado com sucesso');
          });

         
      }
  });
});

app.post('/alterar-senha', (req, res) => {

  const email = req.body.email;
  const senha = req.body.senha;
  const hashedPassword = CryptoJS.SHA256(senha).toString();
  const code = req.body.code;

          const UPDATE_TICKET_QUERY = 'UPDATE users SET password = ?, code = NULL WHERE (email = ? AND code = ?);';
          connection.query(UPDATE_TICKET_QUERY, [hashedPassword, email, code], (err, results) => {
            if (err) {
              console.error('Erro ao alterar a senha:', err);
              return res.status(500).json({ error: 'Erro ao alterar a senha' });
            }
        
            console.log('Senha alterada com sucesso:', results);
            res.status(200).json({ results });
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const medicoRoutes = require('./routes/medicoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota raiz
app.get('/', (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: 'API Hospital no ar.',
    recursos: ['/medico'],
  });
});

// Rotas
app.use('/medico', medicoRoutes);

// 404 - rota não encontrada
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada.' });
});

// Tratamento global de erros (ex.: JSON malformado no body)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ sucesso: false, mensagem: 'JSON malformado no corpo da requisição.' });
  }
  console.error('[ERRO]', err);
  res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
});

module.exports = app;

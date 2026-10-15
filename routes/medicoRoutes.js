const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

// Códigos de erro que indicam problema de conexão com o banco
const CONNECTION_ERRORS = [
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'PROTOCOL_CONNECTION_LOST',
  'ER_ACCESS_DENIED_ERROR',
  'ER_BAD_DB_ERROR',
  'ER_CON_COUNT_ERROR',
];

function handleDbError(err, res) {
  console.error('[DB ERROR]', err.code || '', err.message);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      sucesso: false,
      mensagem: 'Já existe um médico cadastrado com este CRM.',
    });
  }

  if (CONNECTION_ERRORS.includes(err.code)) {
    return res.status(503).json({
      sucesso: false,
      mensagem: 'Falha na conexão com o banco de dados.',
    });
  }

  return res.status(500).json({
    sucesso: false,
    mensagem: 'Erro ao executar a operação no banco de dados.',
  });
}

function validarId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
    return null;
  }
  return id;
}

function validarCorpo(body) {
  const erros = [];
  const campos = ['nome', 'especialidade', 'crm'];
  campos.forEach((campo) => {
    if (typeof body[campo] !== 'string' || body[campo].trim() === '') {
      erros.push(`O campo "${campo}" é obrigatório e deve ser um texto não vazio.`);
    }
  });
  return erros;
}

// Rotas

// GET /medico - lista todos
router.get('/', async (req, res) => {
  try {
    const medicos = await query(
      'SELECT id, nome, especialidade, crm FROM medico ORDER BY id'
    );
    res.status(200).json({ sucesso: true, total: medicos.length, dados: medicos });
  } catch (err) {
    handleDbError(err, res);
  }
});

// GET /medico/:id - busca por id
router.get('/:id', async (req, res) => {
  const id = validarId(req, res);
  if (id === null) return;

  try {
    const medicos = await query(
      'SELECT id, nome, especialidade, crm FROM medico WHERE id = ?',
      [id]
    );
    if (medicos.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Médico não encontrado.' });
    }
    res.status(200).json({ sucesso: true, dados: medicos[0] });
  } catch (err) {
    handleDbError(err, res);
  }
});

// POST /medico - cria
router.post('/', async (req, res) => {
  const erros = validarCorpo(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'Dados inválidos.', erros });
  }

  const nome = req.body.nome.trim();
  const especialidade = req.body.especialidade.trim();
  const crm = req.body.crm.trim();

  try {
    const result = await query(
      'INSERT INTO medico (nome, especialidade, crm) VALUES (?, ?, ?)',
      [nome, especialidade, crm]
    );
    res.status(201).json({
      sucesso: true,
      mensagem: 'Médico cadastrado com sucesso.',
      dados: { id: result.insertId, nome, especialidade, crm },
    });
  } catch (err) {
    handleDbError(err, res);
  }
});

// PUT /medico/:id - atualiza
router.put('/:id', async (req, res) => {
  const id = validarId(req, res);
  if (id === null) return;

  const erros = validarCorpo(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ sucesso: false, mensagem: 'Dados inválidos.', erros });
  }

  const nome = req.body.nome.trim();
  const especialidade = req.body.especialidade.trim();
  const crm = req.body.crm.trim();

  try {
    const result = await query(
      'UPDATE medico SET nome = ?, especialidade = ?, crm = ? WHERE id = ?',
      [nome, especialidade, crm, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Médico não encontrado.' });
    }
    res.status(200).json({
      sucesso: true,
      mensagem: 'Médico atualizado com sucesso.',
      dados: { id, nome, especialidade, crm },
    });
  } catch (err) {
    handleDbError(err, res);
  }
});

// DELETE /medico/:id - remove
router.delete('/:id', async (req, res) => {
  const id = validarId(req, res);
  if (id === null) return;

  try {
    const result = await query('DELETE FROM medico WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Médico não encontrado.' });
    }
    res.status(200).json({ sucesso: true, mensagem: 'Médico removido com sucesso.' });
  } catch (err) {
    handleDbError(err, res);
  }
});

module.exports = router;

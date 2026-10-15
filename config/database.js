const mysql = require('mysql');

// Configuração via variáveis de ambiente
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital',
});

/**
 * Executa uma query SQL com binding de parâmetros (?), retornando Promise.
 */
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

/**
 * Testa a conexão com o banco (usado na inicialização do servidor).
 */
function testConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.release();
      resolve();
    });
  });
}

module.exports = { pool, query, testConnection };

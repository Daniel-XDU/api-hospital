const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  try {
    await testConnection();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error(`Aviso: não foi possível conectar ao banco (${err.code || err.message}).`);
    console.error('Verifique se o MySQL/MariaDB está ativo e se o script database/script.sql foi executado.');
  }
});

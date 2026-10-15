# API Hospital

API REST em Node.js + Express para gerenciamento de **médicos** de um hospital.

**Stack:** Node.js, Express, MySQL (módulo `mysql`), MariaDB/MySQL, morgan, body-parser, cors, nodemon.

## Estrutura

```
api-hospital/
├── app.js                  # configuração do Express e middlewares
├── server.js               # inicialização do servidor
├── config/database.js      # conexão (pool) com o banco
├── routes/medicoRoutes.js  # rotas do recurso médico
├── database/script.sql     # criação do banco/tabela
└── package.json
```

## Como executar

1. Crie o banco e a tabela:
   ```bash
   mysql -u root -p < database/script.sql
   ```
2. Instale as dependências e inicie:
   ```bash
   npm install
   npm start
   ```
   Para desenvolvimento com recarga automática: `npm run dev`.

### Variáveis de ambiente (opcionais)

| Variável      | Padrão      |
|---------------|-------------|
| PORT          | 3000        |
| DB_HOST       | localhost   |
| DB_PORT       | 3306        |
| DB_USER       | root        |
| DB_PASSWORD   | (vazio)     |
| DB_NAME       | hospital    |

> **MySQL 8:** o módulo `mysql` não suporta o plugin `caching_sha2_password`. Se receber `ER_NOT_SUPPORTED_AUTH_MODE`, execute:
> `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua senha';`
> No MariaDB isso não é necessário.

## Endpoints

| Método | Rota          | Descrição              |
|--------|---------------|------------------------|
| GET    | /medico       | Lista todos            |
| GET    | /medico/:id   | Busca por id           |
| POST   | /medico       | Cadastra               |
| PUT    | /medico/:id   | Atualiza               |
| DELETE | /medico/:id   | Remove                 |

### Exemplo de corpo (POST/PUT)

```json
{
  "nome": "Dr. João Pereira",
  "especialidade": "Neurologia",
  "crm": "CRM-GO 45678"
}
```

### Códigos de resposta

`200` ok · `201` criado · `400` dados/ID inválidos · `404` não encontrado · `409` CRM duplicado · `503` falha de conexão com o banco · `500` erro interno.

### Testes rápidos com curl

```bash
curl http://localhost:3000/medico
curl http://localhost:3000/medico/1
curl -X POST http://localhost:3000/medico -H "Content-Type: application/json" \
  -d '{"nome":"Dr. João Pereira","especialidade":"Neurologia","crm":"CRM-GO 45678"}'
curl -X PUT http://localhost:3000/medico/1 -H "Content-Type: application/json" \
  -d '{"nome":"Dra. Ana Souza","especialidade":"Cardiologia","crm":"CRM-GO 12345"}'
curl -X DELETE http://localhost:3000/medico/1
```

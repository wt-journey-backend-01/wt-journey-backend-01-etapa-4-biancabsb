<!-- # INSTRUCTIONS.md

## Instruções para Rodar a API com PostgreSQL

### 1. Subir o banco de dados com Docker
- Certifique-se de ter Docker e Docker Compose instalados.
- Crie um arquivo `.env` na raiz do projeto com:
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
NODE_ENV=development
JWT_SECRET=umsegurosegredo
SALT_ROUNDS=10
- Crie um arquivo `docker-compose.yml` configurando o PostgreSQL com volume persistente.
- Suba o container: `docker-compose up -d`
- Verifique se está rodando: `docker ps`

### 2. Executar migrations
- Instale as dependências: `npm install`
- Execute as migrations: `npx knex migrate:latest`
- **Atenção:** primeiro `agentes`, depois `casos`.

### 3. Rodar seeds
- Execute as seeds: `npx knex seed:run`
- Banco configurado e API pronta para uso.

---

## 4. Autenticação e Segurança

A API utiliza **JWT (JSON Web Token)** para autenticação.  
Todas as rotas **protegidas** exigem o envio de um token válido no header `Authorization`.

### 4.1 Registro de Usuário
Endpoint:  
POST /auth/register

Body esperado:
```json
{
  "nome": "João da Silva",
  "email": "joao@example.com",
  "senha": "SenhaSegura@123"
}
Retorno (201):
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "nome": "João da Silva",
    "email": "joao@example.com"
  }
}
4.2 Login

Endpoint:
POST /auth/login
Body esperado:
{
  "email": "joao@example.com",
  "senha": "SenhaSegura@123"
}
Retorno (200):
{
  "access_token": "jwt_aqui"
}
4.3 Envio do Token JWT

Em todas as rotas autenticadas, o token deve ser enviado no header:
Authorization: Bearer <token>
Exemplo com curl:
curl -X GET http://localhost:3000/agentes \
  -H "Authorization: Bearer jwt_aqui"
4.4 Fluxo de Autenticação Esperado

Usuário se registra (POST /auth/register).

Usuário faz login (POST /auth/login) e recebe um token JWT.

Para acessar rotas protegidas, o cliente deve enviar o token no header Authorization.

O token expira após 1 dia (expiresIn: "1d").
Após expiração, é necessário fazer login novamente.







# INSTRUCTIONS.md
# Instruções para Rodar a API com PostgreSQL
# 1. Subir o banco de dados com Docker
# - Certifique-se de ter Docker e Docker Compose instalados.
# - Crie um arquivo `.env` na raiz do projeto com:
#   POSTGRES_USER=postgres
#   POSTGRES_PASSWORD=postgres
#   POSTGRES_DB=policia_db
#   NODE_ENV=development
# - Crie um arquivo `docker-compose.yml` configurando o PostgreSQL com volume persistente.
# - Suba o container: docker-compose up -d
# - Verifique se está rodando: docker ps
# 2. Executar migrations
# - Instale as dependências: npm install
# - Execute as migrations: npx knex migrate:latest
# - Atenção à ordem: primeiro agentes e depois casos
# 3. Rodar seeds
# - Execute as seeds: npx knex seed:run
# Banco configurado e API pronta para uso. -->

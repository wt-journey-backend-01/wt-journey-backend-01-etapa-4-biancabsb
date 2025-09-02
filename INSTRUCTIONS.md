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
# Banco configurado e API pronta para uso.

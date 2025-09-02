const knexConfig = require('../knexfile');
const knex = require('knex'); 

const nodeEnv = process.env.NODE_ENV || 'development';
const config = knexConfig[nodeEnv]; 

const db = knex(config);

db.raw('SELECT 1')
  .then(() => console.log('Conexão com o banco OK!'))
  .catch(err => console.error('Erro na conexão com o banco:', err));

module.exports = db;
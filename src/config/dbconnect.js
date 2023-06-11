import mysql2 from 'mysql2';

const conexao = mysql2.createConnection({
    host: "localhost",
    user: 'don',
    password: 'blandest12',
    database: 'dbnodeteste'
});

export default conexao;
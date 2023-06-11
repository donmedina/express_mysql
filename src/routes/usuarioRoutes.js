import express from 'express';
import UsuariosController from '../controllers/usuariosController.js'
import conexao from '../config/dbconnect.js';

const routesUsuarios = express.Router();

conexao.connect();

routesUsuarios
    .get('/usuarios', UsuariosController.listarUsuarios)
    .post('/autenticar', UsuariosController.authUser)
    .post('/cadastrar', UsuariosController.createUser)

export default routesUsuarios;
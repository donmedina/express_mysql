import express from 'express';
import UsuariosController from '../controllers/usuariosController.js'

const routesUsuarios = express.Router();

routesUsuarios
    .post('/autenticar',
        UsuariosController.authUser)
    .get('/usuarios',
        UsuariosController.verifyJWT,
        UsuariosController.listarUsuarios)
    .post('/cadastrar',
        UsuariosController.verifyJWT,
        UsuariosController.verifyPermission,
        UsuariosController.verifyUUID,
        UsuariosController.createUser)
    .post('/deletar',
        UsuariosController.verifyJWT,
        UsuariosController.verifyPermission,
        UsuariosController.verifyExistUsuer,
        UsuariosController.deleteUser)

export default routesUsuarios;
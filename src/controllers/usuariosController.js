import conexao from "../config/dbconnect.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();


class UsuariosController {

    //Middlewares
    static verifyJWT(req, res, next) {
        const token = req.cookies.token;
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err)
                return res.status(401).end();

            req.userId = decode.userId;
            next();
        });
    }

    static verifyPermission(req, res, next) {
        const userID = req.userId;
        const qSQL = "select acesso from usuarios where id = ?";

        try {
            conexao.connect();
            conexao.query(qSQL, userID, (err, result) => {
                const permissao = result[0]['acesso'];
                if (permissao === process.env.CREATE_USER_PERMISSION) {
                    next();
                } else {
                    return res.status(401).end();
                }
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static verifyExistUsuer(req, res, next) {
        const userID = req.body.id;
        const qSQL = "select * from usuarios where id = ?";

        try {
            conexao.connect();
            conexao.query(qSQL, userID, async (err, result) => {
                if (err)
                    return res.status(401).json({ "erro": err }).end();

                if (result <= 0)
                    return res.status(400).json({ "mensagem": "Usuário não localizado" }).end();
                next();
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static verifyUUID(req, res, next) {
        const idUUID = uuidv4();
        const qSQL = "select id from usuarios where id = ?"
        try {
            conexao.connect();
            conexao.query(qSQL, idUUID, (err, result) => {
                if (err || result > 0) {
                    return res.status(401).json({ "erro": err }).end();
                } else {
                    req.idUUID = idUUID;
                    next();
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    }

    //Rotas
    static listarUsuarios = (_, res) => {
        const querySql = "select id, nome, usuario from usuarios";

        try {
            conexao.connect();
            conexao.query(querySql, (_, resultado) => {
                res.status(200).json(resultado);
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static createUser = async (req, res) => {
        const { nome, usuario, senha, acesso } = req.body;
        const hash = await bcrypt.hash(senha, 10);
        const senhaHash = hash;
        const qSQL = "insert into usuarios (id, nome, usuario, senha, acesso) values (?,?,?,?,?)"
        const id = req.idUUID
        
        try {
            conexao.connect();
            conexao.query(qSQL, [id, nome, usuario, senhaHash, acesso], (err, result) => {
                if (err) {
                    res.status(400).json({ message: `Não foi possivel criar o usuário - ${err.message}` });
                } else {
                    res.status(202).json(result);
                }
            })
        } catch (err) {
            res.status(500).json({ message: err.message });
        }

    }

    static deleteUser = async (req, res) => {
        const id = req.body.id
        const qSQL = "delete from usuarios where id = ?"

        try {
            conexao.connect();
            conexao.query(qSQL, id, (err, result) => {
                if (err) {
                    res.status(400).json({ message: `Não foi possivel excluir o usuário - ${err.message}` });
                } else {
                    res.status(200).json({ message: 'Usuário excluído com sucesso.' });
                }
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static authUser = async (req, res) => {
        const usuario = req.body.usuario;
        const senha = req.body.senha;

        try {
            conexao.connect();
            conexao.query("select id, usuario, senha from usuarios where usuario = ?", usuario, async (err, result) => {
                if (result <= 0)
                    return res.status(401).json({ 'mensagem': 'Usuario ou senha inválido(s).' });

                const resSenha = result[0]['senha'];

                if (!await bcrypt.compare(senha, resSenha))
                    return res.status(401).json({ 'mensagem': 'Usuario ou senha inválido(s).' });

                const token = jwt.sign({ userId: result[0]['id'] }, process.env.SECRET_KEY, { expiresIn: 300 })
                res.cookie("token", token, {
                    httpOnly: true,
                    // signed: true,
                    secure: true,
                    maxAge: 300000
                });
                
                res.status(202).json({ 'auth': true });

            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default UsuariosController;
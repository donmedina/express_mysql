import conexao from "../config/dbconnect.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class UsuariosController {

    static verifyJWT(req, res, next) {
        const token = req.headers['x-access-token'];
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err)
                return res.status(401).end();
            
            req.userId = decode.userId;
            next();
        });
    }

    static verifyPermission (req, res, next){
        const userID = req.userId;
        const qSQL = "select acesso from usuarios where id = ?";

        try {
            conexao.connect();
            conexao.query(qSQL, userID, (err, result)=>{
                const permissao = result[0]['acesso'];
                if ( permissao === "total"){
                    next();
                }else{
                    return res.status(401).end(); 
                }
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

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
        const qSQL = "insert into usuarios (nome, usuario, senha, acesso) values (?,?,?,?)"

        try {
            conexao.connect();
            conexao.query(qSQL, [nome, usuario, senhaHash, acesso], (err, result) => {
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
                res.status(202).json({ auth: true, token });

            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default UsuariosController;
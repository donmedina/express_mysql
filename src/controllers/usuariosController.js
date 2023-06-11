import conexao from "../config/dbconnect.js";
import bcrypt from 'bcrypt';

class UsuariosController {

    static listarUsuarios = (_, res) => {
        const querySql = "select nome from usuarios";

        try {
            conexao.query(querySql, (_, resultado) => {
                res.status(200).json(resultado);
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static createUser = async (req, res) => {
        const { nome, usuario, senha } = req.body;
        const hash = await bcrypt.hash(senha, 10);
        const senhaHash = hash;
        const qSQL = "insert into usuarios (nome, usuario, senha) values (?,?,?)"

        try {
            conexao.query(qSQL, [nome, usuario, senhaHash], (err, result) => {
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

        conexao.query("select usuario, senha from usuarios where usuario = ?", usuario, async (err, result) => {
            if (result <= 0)
                return res.status(401).json({ 'mensagem': 'Usuario inválidos' });
         
            const resSenha = result[0]['senha'];
            console.log(resSenha);
            console.log(senha);

            if (!await bcrypt.compare(senha, resSenha))
                return res.status(401).json({ 'mensagem': 'Senha inválida' });

            res.send(result);

        })
}
}

export default UsuariosController;
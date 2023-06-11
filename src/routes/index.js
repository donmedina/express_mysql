import express from 'express';
import routesUsuarios from './usuarioRoutes.js';

const routes = (app) => {
    app.route('/').get((_,res)=>{
        res.status(200).send({'mensagem':'Rota inicial. Para verificar as possíveis rotas e seus usos, consulte a documentação'});
    })

    app.use(
        express.json(),
        routesUsuarios
    )
}

export default routes;
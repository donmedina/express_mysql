# API de autenticação

Esse projeto foi desenvolvido, como estudo na criação de uma API para autenticação. 

| :placard: Vitrine.Dev |     |
| -------------  | --- |
| :sparkles: Nome        | **API Autenticação**
| :label: Tecnologias | NodeJs, Javascript, Express, bcrypt, JWT

![](https://i.imgur.com/L3zu4To.png#vitrinedev)

## Detalhes do projeto
API possui:
- Uma rota publica apenas para teste;
- Uma rota de Autenticação, onde é passado no req.body o usuario e senha a ser autenticada. Ao receber essa senha a api utiliza a biblioteca do bcrypt para realizar a validação com o BD MySQL. Após a validação é gerado um JWT e retornado na resposta da requisição.
- Uma rota para Cadastrar o usuario. Nesta rota, é possivel cadastrar um novo usuario no BD, enviando os dados no req.body, porém é preciso enviar um token válido no header da requisição e api irá além de validar o token irá buscar se o mesmo possui permissão de criar um novo usuario.
- Uma rota de listagemd e usuarios, para listar os usuarios é preciso estar autenticado. Esta rota retornará os ids e usuarios.

Todas as variaveis importantes são armazenadas em variaveis de ambiente utilizando o arquivo .env e a biblioteca dotenv.

## Proximas implementações
Utilizar OpenSSL e HTTPS para proteger os dados trafegados pela API.

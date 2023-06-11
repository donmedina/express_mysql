import app from "./src/app.js";
import dotenv from 'dotenv'

dotenv.config();

const port = process.env.SERVER_PORT ;

app.listen(port, () =>{
    console.log(`Servidor local em http://localhost:${port}`)
})
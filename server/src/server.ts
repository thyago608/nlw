import express from 'express';
import Routes from './routes';
import cors from 'cors';

const app = express();
app.use(cors());
// Está sendo utilizado o método json() da dependência EXPRESS
app.use(express.json());
//Está sendo utilizado o arquivo routes.ts para responser as requisições http
app.use(Routes);

app.listen(3333);
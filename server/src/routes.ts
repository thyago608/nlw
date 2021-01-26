import express from 'express';
import ClassesController from './controlles/ClassesController';
import ConnectionsController from './controlles/ConnectionsController';

const routes = express.Router();
const classesControllers = new ClassesController();
const connectionsController = new ConnectionsController();

// Criação de dados
 routes.post('/classes', classesControllers.create);

//Recuperação de dados
routes.get('/classes', classesControllers.index);

routes.post('/connections',connectionsController.create);

routes.get('/connections', connectionsController.index);

export default routes;
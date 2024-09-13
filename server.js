import dotenv from 'dotenv';
dotenv.config();

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import mongoose from 'mongoose';
import Task from './Colecciones/tareas.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger.json' assert { type: 'json' };;

const app = express();

app.use(express.json());

app.use('/doc-apiRest', swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.post('/crearTarea', async (req, res) => {
  try {
    const { nombre, descripcion, terminado } = req.body;
    const newTask = new Task({ nombre, descripcion, terminado });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { nombre, descripcion, terminado } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      { nombre, descripcion, terminado },
      { new: true } 
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/tareas', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PROTO_PATH = './tasks.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const TaskService = grpc.loadPackageDefinition(packageDefinition).TaskService;

mongoose.connect(process.env.DB_CONNECTION)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error(err));

async function GetTasks(call, callback) {
  try {
    const tasks = await Task.find({});
    const taskList = { tasks: tasks.map(task => ({
      id: task._id.toString(),
      nombre: task.nombre,
      descripcion: task.descripcion,
      terminado: task.terminado
    })) };
    callback(null, taskList);
  } catch (err) {
    callback(err);
  }
}

async function GetTaskStats(call, callback) {
  try {
    const totalTasks = await Task.countDocuments({});
    const completedTasks = await Task.countDocuments({ terminado: true });

    const taskStats = {
      totalTareas: totalTasks,
      tareasCompletadas: completedTasks
    };
    callback(null, taskStats);
  } catch (err) {
    callback(err);
  }
}

async function GetTasksByDate(call, callback) {
  try {
    const { date } = call.request;
   
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(startOfDay.getDate() + 1);

    const tasks = await Task.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    });
    
    const taskList = { tasks: tasks.map(task => ({
      id: task._id.toString(),
      nombre: task.nombre,
      descripcion: task.descripcion,
      terminado: task.terminado
    })) };
    callback(null, taskList);
  } catch (err) {
    callback(err);
  }
}

const server = new grpc.Server();
server.addService(TaskService.service, { GetTasks, GetTaskStats, GetTasksByDate });

const address = '0.0.0.0:8000';
server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Servidor gRPC corriendo en ${address}`);
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${process.env.PORT}`);
});

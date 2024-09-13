import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './tasks.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const TaskService = grpc.loadPackageDefinition(packageDefinition).TaskService;

const client = new TaskService('localhost:8000', grpc.credentials.createInsecure());

client.GetTaskStats({}, (err, response) => {
  if (err) throw err;
  console.log("Estadísticas de tareas:");
  console.log(`Total de tareas: ${response.totalTareas}`);
  console.log(`Tareas completadas: ${response.tareasCompletadas}`);
});

const date = '2024-09-08';
client.GetTasksByDate({ date }, (err, response) => {
  if (err) throw err;
  console.log("Tareas creadas en el día:");
  response.tasks.forEach(task => {
    console.log(`ID: ${task.id}`);
    console.log(`Nombre: ${task.nombre}`);
    console.log(`Descripción: ${task.descripcion}`);
    console.log(`Terminado: ${task.terminado}`);
    console.log('---');
  });
});

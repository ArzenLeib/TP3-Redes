import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

// Cargar el archivo proto
const PROTO_PATH = './tasks.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const TaskService = grpc.loadPackageDefinition(packageDefinition).TaskService;

const client = new TaskService('localhost:50051', grpc.credentials.createInsecure());

// Llamar al método GetTaskStats
client.GetTaskStats({}, (err, response) => {
  if (err) throw err;
  console.log("Estadísticas de tareas:");
  console.log(`Total de tareas: ${response.totalTareas}`);
  console.log(`Tareas completadas: ${response.tareasCompletadas}`);
});

// Llamar al método GetTasksByDate
const date = '2024-09-08'; // Cambia esta fecha según sea necesario
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

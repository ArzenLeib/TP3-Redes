import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  terminado: {
    type: Boolean,
    default: false,
  }
},{
  timestamps: true
});

const Task = mongoose.model('Tareas', taskSchema);

export default Task;
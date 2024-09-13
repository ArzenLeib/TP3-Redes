# Documentación del Proyecto

## Documentación API-REST
Para acceder a la documentación de la API-REST, sigue estos pasos:

1. Ir al directorio del proyecto.
2. Abrir la Terminal.
3. Instalar los paquetes con el comando `npm install`, si es necesario.
4. Arrancar el servidor con el comando `npm run`.
5. Acceder a [localhost:3000/doc-apirest](http://localhost:3000/doc-apirest) en tu navegador.

## Documentación gRPC
### 1. `GetTasks`

**Descripción:** Obtiene el listado de todas las tareas.

**Respuesta:**
```json
{
  "tasks": [
    {
      "id": "string",
      "nombre": "string",
      "descripcion": "string",
      "terminado": "boolean"
    }
  ]
} 
```

### 2. `GetTaskStats`

   **Descripción:** Obtiene estadísticas de las tareas.

   **Solicitud:** `Empty`

   **Respuesta:**
   ```json
   {
 	"totalTareas": "int32",
 	"tareasCompletadas": "int32"
   }
   ```


### 3. `GetTasksByDate`

   **Descripción:** Obtiene el listado de tareas hechas en la fecha específica.

   **Solicitud:**
   ```json
   {
 	"date": "string" // Fecha en formato 'YYYY-MM-DD'
   }
   ```

   **Respuesta:**
   ```json
   {
 	"tasks": [
   	{
     	"id": "string",
     	"nombre": "string",
     	"descripcion": "string",
     	"terminado": "boolean"
   	}
 	]
   }
   ```

const form = document.getElementById('tarea-form');
const input = document.getElementById('tarea-input');
const lista = document.getElementById('lista-tareas');

// 1. LEER (Read) - Obtener tareas al cargar la página
async function cargarTareas() {
    try {
        const res = await fetch('/tareas');
        const tareas = await res.json();
        
        lista.innerHTML = ''; // Limpiamos la lista antes de llenarla

        tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${tarea.titulo}</span>
                <div class="acciones">
                    <button class="btn-edit" onclick="editarTarea(${tarea.id}, '${tarea.titulo}')">✏️</button>
                    <button class="btn-delete" onclick="eliminarTarea(${tarea.id})">🗑️</button>
                </div>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}

// 2. CREAR (Create) - Enviar nueva tarea al servidor
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = input.value;

    await fetch('/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo })
    });

    input.value = ''; // Limpiar input
    cargarTareas();   // Recargar lista
});

// 3. ACTUALIZAR (Update) - Modificar una tarea existente
async function editarTarea(id, tituloActual) {
    const nuevoTitulo = prompt("Edita tu tarea:", tituloActual);
    
    if (nuevoTitulo && nuevoTitulo.trim() !== "" && nuevoTitulo !== tituloActual) {
        await fetch(`/tareas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: nuevoTitulo })
        });
        cargarTareas();
    }
}

// 4. ELIMINAR (Delete) - Borrar una tarea
async function eliminarTarea(id) {
    if (confirm("¿Estás seguro de eliminar esta tarea?")) {
        await fetch(`/tareas/${id}`, {
            method: 'DELETE'
        });
        cargarTareas();
    }
}

// Ejecutar al iniciar
cargarTareas();
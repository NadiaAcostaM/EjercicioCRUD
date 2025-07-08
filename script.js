// URL base de la API - Endpoint principal para las operaciones CRUD de productos
const API_URL = "http://basesqlapi.somee.com/api/Producto";

// Espera a que el DOM esté completamente cargado
$(document).ready(function () {

    // Carga la lista de productos apenas se abra la página
    cargarProductos();

    // Cuando el formulario se envía (Evento submit del formulario para crear/editar productos)
    $("#formProducto").submit(function (e) {
        e.preventDefault();

        // Objeto con los datos del formulario
        const producto = {
            idProducto: $("#idProducto").val() || 0,
            codigoBarra: $("#codigoBarra").val(),
            nombre: $("#nombre").val(),
            marca: $("#marca").val(),
            categoria: $("#categoria").val(),
            precio: parseFloat($("#precio").val())
        };

        // Esto es para determinar si se debe guardar o editar
        // Define la URL y el método HTTP según si es creación (POST) o edición (PUT)
        const url = producto.idProducto == 0 ? `${API_URL}/Guardar` : `${API_URL}/Editar`;
        const method = producto.idProducto == 0 ? "POST" : "PUT";

        // Enviar el producto a la API (Envía la petición a la API)
        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            data: JSON.stringify(producto),
            success: function () {
                $("#formProducto")[0].reset(); // Limpia el formulario
                $("#idProducto").val(0);
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
                modal.hide(); // Cierra el modal
                cargarProductos(); // Recarga la tabla de productos

                // ALERTA DE ÉXITO
                Swal.fire({
                    icon: 'success',
                    title: producto.idProducto == 0 ? 'Producto agregado' : 'Producto actualizado',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar',
                    text: 'Ocurrió un problema al guardar el producto.'
                });
            }
        });
    });
});

// Función para obtener la lista de productos y mostrarlos en la tabla
/*
 * Carga los productos desde la API y los muestra en la tabla HTML.
 * Hace una petición GET a /Lista y genera filas dinámicamente.
*/
function cargarProductos() {
    $.get(`${API_URL}/Lista`, function (data) {
        let filas = "";
        // Recorre cada producto recibido desde la API
        data.response.forEach(p => {
            filas += `<tr>
        <td>${p.idProducto}</td>
        <td>${p.codigoBarra}</td>
        <td>${p.nombre}</td>
        <td>${p.marca}</td>
        <td>${p.categoria}</td>
        <td>$${p.precio.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick='abrirModalEditar(${JSON.stringify(p)})'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-2" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
            </svg>Editar</button>
          <button class="btn btn-sm btn-danger" onclick='eliminarProducto(${p.idProducto})'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash me-2" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>Eliminar</button>
        </td>
      </tr>`;
        });
        // Inserta en la tabla
        $("#tablaProductos").html(filas);
    });
}

// function abrirModalNuevo() {
//     $("#formProducto")[0].reset();
//     $("#idProducto").val(0);
// }

// Carga los datos de un producto en el formulario para editar
/*
 * Carga los datos de un producto existente en el formulario para editar.
 * @param {Object} producto - Objeto con los datos del producto a editar
*/
function abrirModalEditar(producto) {
    $("#idProducto").val(producto.idProducto);
    $("#codigoBarra").val(producto.codigoBarra);
    $("#nombre").val(producto.nombre);
    $("#marca").val(producto.marca);
    $("#categoria").val(producto.categoria);
    $("#precio").val(producto.precio);
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    modal.show();
}

// Elimina un producto usando su ID
/*
 * Elimina un producto después de confirmación.
 * @param {number} id - ID del producto a eliminar
*/
function eliminarProducto(id) {
    // ALERTA DE ÉXITO
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${API_URL}/Eliminar/${id}`,
                type: "DELETE",
                success: function () {
                    cargarProductos();
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'El producto fue eliminado correctamente',
                        timer: 1500,
                        showConfirmButton: false
                    });
                },
                error: function () {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar',
                        text: 'Ocurrió un problema al eliminar el producto.'
                    });
                }
            });
        }
    });
}
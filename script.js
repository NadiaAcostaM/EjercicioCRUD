// URL base de la API
const API_URL = "http://basesqlapi.somee.com/api/Producto";

// Espera a que el DOM esté completamente cargado
$(document).ready(function () {

    // Carga la lista de productos apenas se abra la página
    cargarProductos();

    // Cuando el formulario se envía
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
        const url = producto.idProducto == 0 ? `${API_URL}/Guardar` : `${API_URL}/Editar`;
        const method = producto.idProducto == 0 ? "POST" : "PUT";

        // Enviar el producto a la API
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
          <button class="btn btn-sm btn-warning me-1" onclick='abrirModalEditar(${JSON.stringify(p)})'><i class="fa-solid fa-pen-to-square me-2"></i>Editar</button>
          <button class="btn btn-sm btn-danger" onclick='eliminarProducto(${p.idProducto})'><i class="fa-solid fa-trash-can me-2"></i>Eliminar</button>
        </td>
      </tr>`;
        });
        // Inserta en la tabla
        $("#tablaProductos").html(filas);
    });
}

function abrirModalNuevo() {
    $("#formProducto")[0].reset();
    $("#idProducto").val(0);
}

// Carga los datos de un producto en el formulario para editar
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
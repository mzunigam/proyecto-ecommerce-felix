const DOMEvents = {
    init() {
        this.btnPendientePago();
        this.btnEditarDireccion();
    },
    btnPendientePago() {
        document.getElementById('btnPendientePago').addEventListener('click', function () {
            listarPendientePago();
        });
    },
    btnEditarDireccion() {
        document.getElementById('btnEditarDireccion').addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            editarDireccionExecute(id);
        });
    }
}

// Peticiones
const HttpRequest = {
    execProcGestionCompras(json) {
        return new Promise((resolve, reject) => {
            fetch('http://13.59.147.125:8080/api/procedure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    procedure: '{ CALL SP_FW_GESTION_COMPRAS(?,?,?,?)}', // 4 parametros
                    params: [json['accion'],
                        json['id'] ?? 0,
                        json['estado'] ?? 0,
                        json['direccion'] ?? ''
                    ]
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject('Error en la petición');
                    }
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject('Error en la petición');
                });
        });
    }
}

function listarPendientePago() {
    const json = {
        accion: 1,
        estado: 0
    }

    try {
        HttpRequest.execProcGestionCompras(json).then(response => {
            if (response.status) {
                const section = document.getElementById('section-compras');
                const data = response.data;
                let body = `<div class="container">`;
                data.forEach(x => {
                    body += `
                        <ul class="compra-list">
                            <li class="compra-item">
                                <span class="col-md-2 text-center">
                                    <img class="compra-image" src="${x.img}" alt="">
                                </span>
                                <span class="compra-titulo col-md-3">${x.nombre}</span>
                                <span class="compra-precio col-md-1 text-center">S/ ${x.precio}</span>
                                <span class="compra-cantidad col-md-2 text-center">${x.cantidad} unidad(es)</span>
                                <span class="compra-direccion col-md-2 text-center">${x.direccion}</span>
                                <span class="compra-fecha col-md-2 text-center">${x.fecha}</span>
                                <span class="content-compra-accion col-md-1">
                                    <a id="btnEditar_${x.id}" href="#" class="compra-action-editar-penPago">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                    </a>
                                    <a id="btnEliminar_${x.id}" href="#" class="compra-action-eliminar-penPago">
                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </li>
                        </ul>`;
                });
                body += `</div>`;
                section.innerHTML = body;

                // Edicion
                const arrayEditar = document.getElementsByClassName('compra-action-editar-penPago');
                Array.from(arrayEditar).forEach(x => {
                    x.addEventListener('click', function () {
                        const id = parseInt(this.id.split('_')[1]);
                        modalEditarPenPago(id);
                    });
                });

                // Eliminacion
                const arrayEliminar = document.getElementsByClassName('compra-action-eliminar-penPago');
                Array.from(arrayEliminar).forEach(x => {
                    x.addEventListener('click', function () {
                        const id = this.id.split('_')[1];
                        eliminarCompra(id);
                    });
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function modalEditarPenPago(id) {
    const btnEditar = document.getElementById('btnEditarDireccion');
    btnEditar.setAttribute('data-id', id);
    const json = {
        accion: 2,
        id: id
    }

    try {
        HttpRequest.execProcGestionCompras(json).then(response => {
            if (response.status) {
                const data = response.data[0];
                document.getElementById('titleProductoDireccion').textContent = data.nombre;
                document.getElementById('imgProductoDireccion').src = data.img;
            }
        });

    } catch (error) {
        console.log(error);
    } finally {
        $('#modalEditarDireccion').modal('show');
    }
}

function editarDireccionExecute(id) {
    const json = {
        accion: 3,
        id: id,
        direccion: document.getElementById('txtDireccion').value
    }

    HttpRequest.execProcGestionCompras(json).then(response => {
        Swal.fire({
            title: '¡Éxito!',
            text: 'Se modificó la dirección con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                $('#modalEditarDireccion').modal('hide');
                listarPendientePago();
            }
        });
    });
}

function eliminarCompra(id) {
    const json = {
        accion: 4,
        id: id
    }

    Swal.fire({
        title: '¿Está seguro?',
        text: "¡No podrá revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            HttpRequest.execProcGestionCompras(json).then(response => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se eliminó la compra con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        listarPendientePago();
                    }
                });
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init()
});
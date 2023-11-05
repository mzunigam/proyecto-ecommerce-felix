const DOMEvents = {
    init() {
        this.btnPendientePago();
        this.btnPendienteEnvio();
        this.btnEnviado();
        this.btnPendienteValoracion();
        this.btnEditarDireccion();
    },
    btnPendientePago() {
        document.getElementById('btnPendientePago').addEventListener('click', function () {
            botonesNav('btnPendientePago');
            listarCompras(0);
        });
    },
    btnPendienteEnvio() {
        document.getElementById('btnPendienteEnvio').addEventListener('click', function () {
            botonesNav('btnPendienteEnvio');
            listarCompras(1);
        });
    },
    btnEnviado() {
        document.getElementById('btnEnviado').addEventListener('click', function () {
            botonesNav('btnEnviado');
            listarCompras(2);
        });
    },
    btnPendienteValoracion() {
        document.getElementById('btnPendienteValoracion').addEventListener('click', function () {
            botonesNav('btnPendienteValoracion');
            listarCompras(3);
        });
    },
    btnEditarDireccion() {
        document.getElementById('btnEditarDireccion').addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            editarDireccionExecute(id);
        });
    }
}

function botonesNav(btn) {
    document.querySelectorAll('.btnNav').forEach((element) => {
        element.classList.remove('btn-clickeado');
    });

    document.getElementById(btn).classList.add('btn-clickeado');
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

function listarCompras(estado) {

    /* estado:
        0: Pendiente de pago
        1: Pendiente de envio
        2: Enviado
        3: Pendiente de valoracion
     */

    const json = {
        accion: 1,
        estado: estado
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
                                <span class="compra-fecha col-md-2 text-center">${x.fecha}</span>`;


                    if (estado === 0) {
                        body += `<span class="content-compra-accion col-md-1">
                                <a id="btnEditar_${x.id}" href="#" class="compra-action-editar-direccion">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                </a>
                                <a id="btnEliminar_${x.id}" href="#" class="compra-action-eliminar-penPago">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </a>
                            </span>`;
                    } else if (estado === 1) {
                        body += `<span class="content-compra-accion col-md-1">
                                <a id="btnEditar_${x.id}" href="#" class="compra-action-editar-direccion">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                </a>
                                <a id="btnCancelarEnvio_${x.id}" href="#" class="compra-action-eliminar-penPago">
                                    <i class="fa fa-undo" aria-hidden="true"></i>
                                </a>
                            </span>`;
                    } else if (estado === 3) {
                        body += `<span class="content-compra-accion col-md-2">
                                    <ul id="valoracion_${x.id}" class="star-rating">
                                        <li class="star">&#9733;</li>
                                        <li class="star">&#9733;</li>
                                        <li class="star">&#9733;</li>
                                        <li class="star">&#9733;</li>
                                        <li class="star">&#9733;</li>
                                    </ul>
                                </span>`;
                    }

                    body += `</li>
                        </ul>`;
                });
                body += `</div>`;
                section.innerHTML = body;

                if (estado === 0) {
                    // Edicion direccion
                    const arrayEditar = document.getElementsByClassName('compra-action-editar-direccion');
                    Array.from(arrayEditar).forEach(x => {
                        x.addEventListener('click', function () {
                            const id = parseInt(this.id.split('_')[1]);
                            modalEditarDireccion(id);
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
                } else if (estado === 1) {
                    // Editar direccion
                    const arrayEditar = document.getElementsByClassName('compra-action-editar-direccion');
                    Array.from(arrayEditar).forEach(x => {
                        x.addEventListener('click', function () {
                            const id = parseInt(this.id.split('_')[1]);
                            modalEditarDireccion(id);
                        });
                    });
                } else if (estado === 3) {
                    $('.star').on('click', function () {
                        $(this).toggleClass('active');
                        $(this).prevAll().addClass('active');
                        $(this).nextAll().removeClass('active');
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function modalEditarDireccion(id) {
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
                document.getElementById('txtDireccion').value = data.direccion;
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
        $('#modalEditarDireccion').modal('hide');
        Swal.fire({
            title: '¡Éxito!',
            text: 'Se modificó la dirección con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                const estado = document.getElementsByClassName('btn-clickeado')[0].getAttribute('data-estado');
                listarCompras(parseInt(estado));
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
                        listarCompras(0);
                    }
                });
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init()
});
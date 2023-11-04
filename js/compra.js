const DOMEvents = {
    init() {
        this.btnPendientePago();
    },
    btnPendientePago() {
        document.getElementById('btnPendientePago').addEventListener('click', function () {
            listarPendientePago();
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
                    procedure: '{ CALL SP_FW_GESTION_COMPRAS(?,?)}', // 2 parametros
                    params: [json['accion'],
                        json['estado'] ?? 0
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
                                <span class="compra-precio col-md-1 text-center">S/${x.precio}</span>
                                <span class="compra-cantidad col-md-2 text-center">${x.cantidad} unidad(es)</span>
                                <span class="compra-direccion col-md-2 text-center">${x.direccion}</span>
                                <span class="compra-fecha col-md-2 text-center">${x.fecha}</span>
                                <span class="content-compra-accion col-md-1">
                                    <a href="#" class="compra-action">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                    </a>
                                    <a href="#" class="compra-action">
                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                    </a>
                                </span>
                            </li>
                        </ul>`;
                });
                body += `</div>`;
                section.innerHTML = body;
            }
        });
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    DOMEvents.init()
});
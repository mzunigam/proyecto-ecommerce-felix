import {cartProduct, storeBrand, storeCategory} from "./Components.js";
import {HTTPRequest} from "./Ajax.js";

Culqi.options({
    lang: "auto",
    installments: false, // Habilitar o deshabilitar el campo de cuotas
    paymentMethods: {
        tarjeta: false,
        yape: true,
        bancaMovil: false,
        agente: false,
        billetera: false,
        cuotealo: false,
    },
    style: {
        logo: 'https://img.freepik.com/vector-gratis/pago-tarjeta-credito-diseno-plano_23-2147673751.jpg?1',
        bannerColor: '#fbb941', // hexadecimal
        buttonBackground: '#fbb941', // hexadecimal
        menuColor: '#fbb941', // hexadecimal
        linksColor: '#fbb941', // hexadecimal
        buttonText: 'Comprar', // texto que tomará el botón
        buttonTextColor: '#fff', // hexadecimal
        priceColor: '#fbb941' // hexadecimal
    }
});

const botonBuscar = () => {
    $('.search-btn').off('click').on('click', async (e) => {
        const categoria = $('.search-category').val();
        const search = $('.search').val();
        const a = document.createElement('a');
        a.href = `store.html?${categoria ? `categoria=${categoria}` : ''}${search ? `&busqueda=${search}` : ''}`;
        a.click();
    });
};

const botonCarrito = () => {
    $('#miCarritoAHREF').off('click').on('click', (e) => {
        setTimeout(() => {
            $('#dropdown-toggle')[0].click();
        }, 500);
    });
}

/*const botonComprar = () => {
    $('#btnComprar').off('click').on('click', (e) => {
        const productos = JSON.parse(localStorage.getItem('micarrito') || '[]');
        const total = productos.reduce((total, producto) => { return total + ( producto.descuento > 0 ? (producto.precio - (producto.precio * (producto.descuento/100))) * producto.cantidad : producto.precio * producto.cantidad) }, 0);

        Culqi.settings({
            title: 'FerriWork',
            currency: 'PEN',  // Este parámetro es requerido para realizar pagos yape
            amount: total * 100,  // Este parámetro es requerido para realizar pagos yape
        });
        e.preventDefault();
        Culqi.open();
    });
}*/
async function procGestionVenta(json) {
    return await HTTPRequest.callProcedure('http://13.59.147.125:8080/backend/api/procedure',
        {
            procedure: '{ CALL base.SP_FW_GESTIONAR_VENTAS(?,?,?,?,?,?,?,?) }',
            params: [json.accion,
                json.id_producto || 0,
                json.can_producto || 0,
                json.pre_producto || 0,
                json.monto || 0,
                json.descuento || 0,
                json.id_cliente || 0,
                json.id_venta || 0]
        });
}

const botonComprar = () => {
    $('#btnComprar').off('click').on('click', (e) => {

        const productos = JSON.parse(localStorage.getItem('micarrito') || '[]');
        const total = productos.reduce((total, producto) => {
            return total + (producto.descuento > 0 ? (producto.precio - (producto.precio * (producto.descuento / 100))) * producto.cantidad : producto.precio * producto.cantidad)
        }, 0);
        const descuento = productos.reduce((totalDescuento, producto) => totalDescuento + producto.descuento, 0);


        Culqi.settings({
            title: 'FerriWork',
            currency: 'PEN',  // Este parámetro es requerido para realizar pagos yape
            amount: total * 100,  // Este parámetro es requerido para realizar pagos yape
        });
        e.preventDefault();
        Culqi.open();

        if (Culqi.token) {  // ¡Objeto Token creado exitosamente!
            const token = Culqi.token.id;
            console.log('Se ha creado un Token: ', token);
        } else if (Culqi.order) {  // ¡Objeto Order creado exitosamente!
            const order = Culqi.order;
            console.log('Se ha creado el objeto Order: ', order);

        } else {
            // Mostramos JSON de objeto error en consola
            console.log('Error : ', Culqi.error);
        }

        const json = {
            accion: 1,
            monto: total,
            descuento: descuento,
            id_cliente: 11
        }

        procGestionVenta(json).then(response => {
            if (response.status) {
                if (response.data.length > 0) {
                    productos.forEach(x => {
                        const jsonDetalle = {
                            accion: 2,
                            id_venta: response.data[0].id_venta,
                            id_producto: x.producto_id,
                            can_producto: parseInt(x.cantidad),
                            pre_producto: x.precio
                        }

                        procGestionVenta(jsonDetalle).then(responseDetalle => {
                            if (responseDetalle.status) {
                                Swal.fire({
                                    title: '¡Gracias por su compra!',
                                    text: "Su compra se realizó con éxito",
                                    icon: 'success',
                                    confirmButtonColor: '#ffae26',
                                    confirmButtonText: 'Aceptar'
                                }).then((result) => {
                                    localStorage.removeItem('micarrito');
                                    loadCarrito();
                                    window.location.href = 'index.html';
                                });
                            } else {
                                Swal.fire({
                                    title: '¡Error!',
                                    text: "Ocurrió un error al realizar su compra",
                                    icon: 'error',
                                    confirmButtonColor: '#ffae26',
                                    confirmButtonText: 'Aceptar'
                                });
                            }
                        });

                    });
                }
            }
        });

    });
}

const loadCarrito = () => {

    const productos = JSON.parse(localStorage.getItem('micarrito') || '[]');

    const cartList = document.querySelector('.cart-list');
    cartList.innerHTML = '';

    if (productos.length > 0) {
        productos.forEach(producto => {
            cartList.innerHTML += cartProduct(producto, true);
        });
        document.querySelectorAll('.cart-btns a, .cart-btns button').forEach(btn => btn.classList.remove('disabled'));
        $('.qty').html(productos.length);
        $('.qty').removeClass('hidden')
    } else {
        cartList.innerHTML = /*html*/`
        <h4>No hay productos en el carrito</h3>`;
        document.querySelectorAll('.cart-btns a, .cart-btns button').forEach(btn => btn.classList.add('disabled'));
        $('.qty').html(0);
        $('.qty').addClass('hidden')
    }

    const small = document.querySelector('.cart-summary small');
    const h5 = document.querySelector('.cart-summary h5');
    const total = productos.reduce((total, producto) => {
        return total + (producto.descuento > 0 ? (producto.precio - (producto.precio * (producto.descuento / 100))) * producto.cantidad : producto.precio * producto.cantidad)
    }, 0);
    small.innerHTML = `Cantidad de productos: ${productos.length}`;
    h5.innerHTML = `Total: S/. ${total}`;

    eliminarCarrito();

}

const toggleMenus = () => {
    $('.menu-toggle > a').on('click', function (e) {
        e.preventDefault();
        $('#responsive-nav').toggleClass('active');
    })

    // Fix cart dropdown from closing
    $('.cart-dropdown').on('click', function (e) {
        e.stopPropagation();
    });
};

const loadSearchCategories = async () => {
    const searchCategories = document.querySelector('.search-category');
    const navbarNav = document.querySelector('.navbar-nav');
    const footerLinks = document.querySelector('.footer-links');
    const response = await HTTPRequest.callProcedure('http://13.59.147.125:8080/backend/api/procedure',
        {
            procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
            params: [5, 0, 0, 0]
        });

    if (response.data.length) {
        searchCategories.innerHTML += /*html*/`<option value="0">Todo</option>`;
        response.data.forEach(category => {
            searchCategories.innerHTML += /*html*/`
            <option value="${category.categoria_id}">${category.nombre}</option>
            `;
        });

        navbarNav.innerHTML += /*html*/`<li class="active"><a href="#">Inicio</a></li>`;
        response.data.forEach(category => {
            navbarNav.innerHTML += /*html*/`<li><a href="store.html?categoria=${category.categoria_id}">${category.nombre}</a></li>`;
            footerLinks.innerHTML += /*html*/`<li><a href="store.html?categoria=${category.categoria_id}">${category.nombre}</a></li>`;
        });

    }
};

const eliminarCarrito = (e) => {

    $('.delete-from-carrito').off('click').on('click', function (e) {
        console.log(e);
        const id = $(e.currentTarget).attr('data-id');
        const productos = JSON.parse(localStorage.getItem('micarrito') || '[]');
        const index = productos.findIndex(producto => producto.producto_id == id);
        const newProductos = productos.filter((producto, i) => i != index);
        localStorage.setItem('micarrito', JSON.stringify(newProductos));
        loadCarrito();
    });

    $('.remove-carrito').off('click').on('click', function (e) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminarán todos los productos del carrito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ffae26',
            cancelButtonColor: 'rgb(27,28,37)',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('micarrito');
                loadCarrito();
            }
        });
    });

}

const btnAgregarCarrito = () => {
    $(document).on('click', '.btnAddCart', async function (e) {
        const dataId = $(e.currentTarget).attr('data-id');
        console.log($(e.currentTarget))
        console.log(dataId);
        const response = await HTTPRequest.callProcedure('http://13.59.147.125:8080/backend/api/procedure',
            {
                procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
                params: [6, Number(dataId), 0, 0]
            });
        if (response.data.length > 0) {
            const data = response.data[0];
            Swal.fire({
                title: '¿Cuantos productos desea agregar?',
                html: "Ingrese la cantidad de productos que desea agregar al carrito " +
                    "<br><div style='width: 100%; display: flex; justify-content: center'>" +
                    "<input style='width: max-content' type='number' id='swal-quantity-product' class='form-control text-center' value='1' min='1' max='100'></div>",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#ffae26',
                cancelButtonColor: 'rgb(27,28,37)',
                confirmButtonText: 'Agregar',
            }).then((result) => {

                if (result.isConfirmed) {
                    data.cantidad = Swal.getHtmlContainer().querySelector('#swal-quantity-product').value || 0;
                    const productos = JSON.parse(localStorage.getItem('micarrito') || '[]');
                    const exists = productos.find(producto => producto.producto_id == data.producto_id);
                    if (exists) {
                        Swal.fire({
                            title: 'Ya existe el producto en el carrito, ¿Desea agregarlo de nuevo?',
                            showDenyButton: true,
                            confirmButtonText: 'Agregar',
                            denyButtonText: `No`,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                productos.push(data);
                                localStorage.setItem('micarrito', JSON.stringify(productos));
                                Swal.fire(
                                    'Mi Carrito',
                                    'El producto se agregó al carrito',
                                    'success'
                                )
                                loadCarrito();
                            }
                        })
                    } else {
                        productos.push(data);
                        localStorage.setItem('micarrito', JSON.stringify(productos));
                        Swal.fire(
                            'Mi Carrito',
                            'El producto se agregó al carrito',
                            'success'
                        )
                        loadCarrito();
                    }
                }
            })
        } else {

        }
    });
}

const verDetalle = () => {
    $(document).on('click', '.btnViewProduct', async function (e) {
        const dataId = $(e.currentTarget).attr('data-id');
        window.location.href = 'product.html?id=' + dataId;
    });
}

const storeCategorias = async () => {
    try {

        const response = await HTTPRequest.callProcedure('http://13.59.147.125:8080/backend/api/procedure',
            {
                procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
                params: [7, 0, 0, 0]
            });

        if (response.data.length > 0) {
            const checkboxFilter = $('.checkbox-filter-category');
            checkboxFilter.html('');
            response.data.forEach(categoria => {
                checkboxFilter.append(storeCategory(categoria));
            });
        }

    } catch (e) {
        console.log(e);
    }
}

const storeMarcas = async () => {
    try {

        const response = await HTTPRequest.callProcedure('http://13.59.147.125:8080/backend/api/procedure',
            {
                procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
                params: [8, 0, 0, 0]
            });

        if (response.data.length > 0) {
            const checkboxFilter = $('.checkbox-filter-brand');
            checkboxFilter.html('');
            response.data.forEach(categoria => {
                checkboxFilter.append(storeBrand(categoria));
            });
        }

    } catch (e) {
        console.log(e);
    }
}


const loader = {
    show: () => {
        const loader = document.createElement('div');
        loader.style.position = 'fixed';
        loader.style.top = '0';
        loader.style.left = '0';
        loader.style.width = '100vw';
        loader.style.height = '100vh';
        loader.style.backgroundColor = 'rgba(0,0,0,0.5)';
        loader.style.zIndex = '999999';
        loader.style.display = 'flex';
        loader.style.justifyContent = 'center';
        loader.style.alignItems = 'center';
        loader.id = 'loader';
        loader.innerHTML = /*html*/`
        <div class="spinner-border text-light" role="status">
            <span><img style="width: 4rem;" alt="cargando.." src="https://i.gifer.com/ZKZg.gif"></span>
        </div>
        `;
        document.body.appendChild(loader);
    },
    hide: () => {
        const loader = document.querySelector('#loader');
        if (loader) {
            loader.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    botonBuscar();
    loadCarrito();
    loadSearchCategories();
    toggleMenus();
    btnAgregarCarrito();
    verDetalle();
    storeCategorias();
    storeMarcas();
    botonCarrito();
    botonComprar();
});

export {
    loadCarrito,
    loader
}
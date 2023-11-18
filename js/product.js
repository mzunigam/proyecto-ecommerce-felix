import {HTTPRequest} from "./helper/Ajax.js";
import {cartProduct, Product} from "./helper/Components.js";
import {initializeSlick} from "./helper/slickHelper.js";
import {loadCarrito} from "./helper/Common.js";

window.addEventListener('DOMContentLoaded', () => {
    loadProductQuery();
    loadNuevosProductos();
    open3d();
});

const addToCarrito = async (json) => {

    const productos = JSON.parse(localStorage.getItem('micarrito') || '[]');
    const exists = productos.some(producto => producto.producto_id === json.producto_id);
    if (exists) {
        Swal.fire({
            title: 'Ya existe el producto en el carrito, ¿Desea agregarlo de nuevo?',
            showDenyButton: true,
            confirmButtonText: 'Agregar',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                productos.push(json);
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
        productos.push(json);
        localStorage.setItem('micarrito', JSON.stringify(productos));
        Swal.fire(
            'Mi Carrito',
            'El producto se agregó al carrito',
            'success'
        )
        loadCarrito();
    }


}


const loadNuevosProductos = async () => {
    const nuevosProductos = document.querySelector('.nuevos-productos');
    nuevosProductos.innerHTML = '';
    const response = await HTTPRequest.callProcedure('http://ferreriwork.com:8081/backend/api/procedure',
        {
            procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
            params: [1,0,0,0]
        });

    if(response.data.length > 0){
        response.data.forEach(producto => {
            nuevosProductos.innerHTML += Product(producto);
        });
        initializeSlick(nuevosProductos);
    }else{
        nuevosProductos.innerHTML = /*html*/`
        <div class="col-md-12" style="display:flex; justify-content:center; align-items:center;">
            <h3 class="text-center">No hay productos nuevos</h3>
            <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" style="height:10rem">
        </div>
        `;
    }


}

const open3d = () => {
    $('.watch-3d').on('click',() => {
        console.log('click')
        $('#modal-3d').css('display','flex');
    });
}

const loadProductQuery = async () => {

    $('.add-to-cart-btn').addClass('disabled');

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || 0;

    if(Number(id) === 1991){
        $('.watch-3d').show();
    }

    try{
        
    const response = await HTTPRequest.callProcedure('http://ferreriwork.com:8081/backend/api/procedure',
        {
            procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
            params: [6,Number(id),0,0]
    });

    if(response.data.length === 1) {
        const producto = response.data[0];
        $('.product-name').html(producto.nombre);
        $('.product-description').html(producto.descripcion);
        $('.product-category').html(`<a href="store.html?categoria=${producto.categoria_id}">${producto.categoria}</a>`);
        $('.product-brand').html(`<a href="store.html?marca=${producto.marca_id}">${producto.marca}</a>`);
        const precio = Number(producto.precio || 0);
        const antiguoPrecio = Number(producto.precio || 0) + (Number(producto.precio || 0) * (Number(producto.descuento || 0)/100));
        $('.precio').html(`S/. ${Number(antiguoPrecio).toFixed(2)}`);
        // $('.product-available').html('Disponible (<b> STOCK : '+ (producto.stock || 0)+'</b>)');
        if(producto.stock > 0){
            $('.product-available').html('Disponible (<b> STOCK : '+ (producto.stock || 0)+'</b>)');
            $('.add-to-cart-btn').removeClass('disabled');
        }else{
            $('.product-available').html('<b class="text-danger">No Disponible</b>');
            $('.add-to-cart-btn').addClass('disabled');
        }
        $('#product-main-img').html(`<div class="product-preview"><img src="${producto.imagen || 'img/default.jpg'}" alt=""></div>`);
        $('#product-imgs').html(`<div class="product-preview"><img src="${producto.imagen || 'img/default.jpg'}" alt=""></div>`);
        $('#categoria-a').attr('href',`store.html?categoria=${producto.categoria_id}`);
        $('.add-to-cart-btn')
            .off('click')
            .on('click',() => addToCarrito({...producto, cantidad:Number($('.product-quantity').val() || 0)}));
    }else{
        window.alert('Producto no encontrado');
        window.location.href = 'index.html';
    }
    loadMods();
    }catch(error){
        console.log(error);
    }

}


const loadMods = (cantidad) => {
    $('#product-main-img').slick({
        infinite: true,
        speed: 300,
        dots: false,
        arrows: true,
        fade: true,
        asNavFor: '#product-imgs',
    });
    $('#product-imgs').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: 0,
        vertical: true,
        asNavFor: '#product-main-img',
        responsive: [{
            breakpoint: 991,
            settings: {
                vertical: false,
                arrows: false,
                dots: true,
            }
        },
        ]
    });
    const zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
        $('#product-main-img .product-preview').zoom();
    }

    $('.input-number').each(function() {
        var $this = $(this),
            $input = $this.find('input[type="number"]'),
            up = $this.find('.qty-up'),
            down = $this.find('.qty-down');

        down.on('click', function () {
            var value = parseInt($input.val()) - 1;
            value = value < 1 ? 1 : value;
            $input.val(value);
            $input.change();
        })

        up.on('click', function () {
            var value = parseInt($input.val()) + 1;
            $input.val(value);
            $input.change();
        })
    });



}
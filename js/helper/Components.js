

const Product = (data) => {
    const {producto_id,nombre,precio,imagen,descuento,nuevo,marca,categoria} = data;
    const precioDescuento = precio - (precio * (descuento/100));
    return /*html*/`
    <div class="product">
        <div class="product-img">
        <img src="${ imagen || 'img/default.jpg'}" alt="">
            <div class="product-label">
                <span class="sale ${descuento || 'hidden'}">-${descuento}%</span>
                <span class="new ${nuevo || 'hidden'}">Nuevo</span>
            </div>
        </div>
        <div class="product-body">
            <p class="product-category">${categoria || 'Categoria'}</p>
            <h3 class="product-name"><a href="#">${nombre}</a></h3>
            <h4 class="product-price">S/. ${ descuento > 0 ? Number(precioDescuento).toFixed(2) : precio } 
            <del class="product-old-price ${descuento || 'hidden'}">S/. ${descuento > 0 ? precio : ''}</del>
            </h4>
            <div class="product-btns">
                <button class="btnAddCart" data-id="${producto_id}"><i class="fa fa-shopping-cart"></i>
                <span class="tooltipp">Añadir a Carrito</span>
                </button>
                <button class="btnViewProduct" data-id="${producto_id}"><i class="fa fa-eye"></i>
                <span class="tooltipp">Ver Producto</span>
                </button>
            </div>
        </div>
    </div>
    `;
}

const Collection = (data) => {
    const {nombre, marca_id, imagen} = data;
    return /*html*/`
    <div class="col-md-4 col-xs-6">
        <div class="shop">
            <div class="shop-img">
                <img src="${ imagen || 'img/default.jpg'}" alt="">
            </div>
            <div class="shop-body">
                <h3>${nombre || 'marca'}<br>COLECCIÓN</h3>
                <a href="store.html?coleccion=${marca_id}" class="cta-btn">Comprar ahora<i class="fa fa-arrow-circle-right"></i></a>
            </div>
        </div>
    </div>
    `;
}

const cartProduct = (data,deleteable = false) => {
    const {producto_id,nombre, precio, imagen,descuento, cantidad} = data;
    const newPrice = (precio - (precio * (descuento/100))) * cantidad;
    const oldPrice = precio * cantidad;
    return /*html*/`
    <div class="product-widget">
        <div class="product-img">
            <img src='${imagen || "img/default.jpg"}' alt="">
        </div>
        <div class="product-body">
            <h3 class="product-name"><a href="product.html?id=${producto_id}">${nombre || '<b class="text-danger">Error Nombre</b>'}</a></h3>
            <h4 class="product-price"><span class="qty-product" style="margin-right: 0.5rem">${ (cantidad + 'x') || 0 }</span>S/. ${ descuento > 0 ? newPrice : oldPrice }
            <del class="product-old-price ${descuento || 'hidden'}">S/. ${descuento > 0 ? oldPrice : ''}</del></h4>
        </div>
        ${!deleteable ? '' : `<button data-id="${producto_id}" class="delete-from-carrito delete"><i class="fa fa-close"></i></button>`}
    </div>
    `;
}


const storeCategory = (data) => {
    const {categoria_id,nombre,cantidad_productos} = data;
    return /*html*/`
    <div class="input-checkbox ${cantidad_productos || 'disabled'}">
        <input type="checkbox" class="category-checkbox" id="category-${categoria_id}" value="${categoria_id}">
        <label for="category-${categoria_id}">
            <span></span>
            ${nombre}
            <small>(${cantidad_productos || 0})</small>
        </label>
    </div>
    `;
}

const storeBrand = (data) => {
    const {marca_id,nombre,cantidad_productos} = data;
    return /*html*/`
    <div class="input-checkbox ${cantidad_productos || 'disabled'}">
        <input type="checkbox" class="brand-checkbox" id="brand-${marca_id}" value="${marca_id}">
        <label for="brand-${marca_id}">
            <span></span>
            ${nombre}
            <small>(${cantidad_productos || 0})</small>
        </label>
    </div>
    `;
}


const storeCardProduct = (data) => {
    const {producto_id,nombre,precio,imagen,descuento,nuevo,marca,categoria} = data;
    console.log(data);
    const precioDescuento = precio - (precio * (descuento/100));
    return /*html*/`
    <div class="col-md-4 col-xs-6">
        <div class="product">
        <div class="product-img">
        <img src="${ imagen || 'img/default.jpg'}" alt="">
            <div class="product-label">
                <span class="sale ${descuento || 'hidden'}">-${descuento}%</span>
                <span class="new ${nuevo || 'hidden'}">Nuevo</span>
            </div>
        </div>
        <div class="product-body">
            <p class="product-category">${categoria || 'Categoria'}</p>
            <h3 class="product-name"><a href="#">${nombre}</a></h3>
            <h4 class="product-price">S/. ${ descuento > 0 ? Number(precioDescuento).toFixed(2) : precio } 
            <del class="product-old-price ${descuento || 'hidden'}">S/. ${descuento > 0 ? precio : ''}</del>
            </h4>
            <div class="product-btns">
                <button class="btnAddCart" data-id="${producto_id}"><i class="fa fa-shopping-cart"></i>
                <span class="tooltipp">Añadir a Carrito</span>
                </button>
                <button class="btnViewProduct" data-id="${producto_id}"><i class="fa fa-eye"></i>
                <span class="tooltipp">Ver Producto</span>
                </button>
            </div>
        </div>
    </div>
    </div>
    `;
}

export {
    Product,
    Collection,
    cartProduct,
    storeCategory,
    storeBrand,
    storeCardProduct
}
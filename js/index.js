import { HTTPRequest } from "./helper/Ajax.js";
import { Collection,Product,cartProduct } from "./helper/Components.js";
import { initializeSlick } from "./helper/slickHelper.js";

document.addEventListener('DOMContentLoaded', () => {
    loadNuevosProductos();
    loadOfertaProductos();
    loadMasVendidos();
    loadCollections();
});

const loadNuevosProductos = async () => {
    const nuevosProductos = document.querySelector('.nuevos-productos');
    nuevosProductos.innerHTML = '';
    const response = await HTTPRequest.callProcedure('https://ferreriwork.com:8443/backend/api/procedure',
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

const loadOfertaProductos = async () => {
    const ofertaProductos = document.querySelector('.oferta-productos');
    ofertaProductos.innerHTML = '';
    const response = await HTTPRequest.callProcedure('https://ferreriwork.com:8443/backend/api/procedure',
    {
        procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
        params: [2,0,0,0]
    });

    if(response.data.length > 0){
        response.data.forEach(producto => {
            ofertaProductos.innerHTML += Product(producto);
        });
        initializeSlick(ofertaProductos);
    }else{
        ofertaProductos.innerHTML = /*html*/`
        <div class="col-md-12" style="display:flex; justify-content:center; align-items:center;">
            <h3 class="text-center">No hay productos en oferta</h3>
            <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" style="height:10rem">
        </div>
        `;
    }


}

const loadCollections = async () => {

    const collections = document.querySelector('.collections');
    const response = await HTTPRequest.callProcedure('https://ferreriwork.com:8443/backend/api/procedure',
        {
            procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
            params: [4,0,0,0]
        });
    if(response.data.length){
        response.data.forEach(collection => {
            collections.innerHTML += Collection(collection);
        });
    }
};

const loadMasVendidos = async () => {
    const one = document.querySelector('.one');
    one.innerHTML = /*html*/`
    <div class="col-md-12" style="display:flex; justify-content:start; align-items:center;">
        <h5 class="text-center">No hay productos</h5>
        <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" style="height:5rem">
    </div>`;
    const two = document.querySelector('.two');
    two.innerHTML = /*html*/`
    <div class="col-md-12" style="display:flex; justify-content:start; align-items:center;">
        <h5 class="text-center">No hay productos</h5>
        <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" style="height:5rem">
    </div>`;
    const three = document.querySelector('.three');
    three.innerHTML = /*html*/`
    <div class="col-md-12" style="display:flex; justify-content:start; align-items:center;">
        <h5 class="text-center">No hay productos</h5>
        <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" style="height:5rem">
    </div>`;

    const response = await HTTPRequest.callProcedure('https://ferreriwork.com:8443/backend/api/procedure',
        {
            procedure: '{ CALL base.SP_FW_OBTENER_PRODUCTOS(?,?,?,?)}',
            params: [3,0,0,0]
        });

        console.log(response);
    if(response.data.length > 0){

        const first9 = response.data.slice(0,9);
        const second9 = response.data.slice(9,18);
        const third9 = response.data.slice(18,27);

        first9.forEach(producto => {
            one.innerHTML += Product(producto);
        });

        second9.forEach(producto => {
            two.innerHTML += Product(producto);
        });

        third9.forEach(producto => {
            three.innerHTML += Product(producto);
        });

    }

}
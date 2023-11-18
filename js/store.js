import {HTTPRequest} from "./helper/Ajax.js";
import {storeCardProduct} from "./helper/Components.js";
import {loader} from "./helper/Common.js";

let currentPage = [];
let batchedData = [];
let maxCount = 0;
let productData = [];
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const coleccion = Number(urlParams.get('coleccion')) || urlParams.get('marca') || 0;
    const categoria = Number(urlParams.get('categoria')) || 0;
    const busqueda = decodeURIComponent(urlParams.get('busqueda') || '');
        if (coleccion || categoria || busqueda) {
            $('#find-producto').val(busqueda);
            setTimeout(() => {
            const branCheckBox = $(`.brand-checkbox[value="${coleccion}"]`);
            const categoryCheckBox = $(`.category-checkbox[value="${categoria}"]`);
            if (!branCheckBox.closest('div').hasClass('disabled')) {
                branCheckBox.prop('checked', true);
            }
            if (!categoryCheckBox.closest('div').hasClass('disabled')) {
                categoryCheckBox.prop('checked', true);
            }
            
            $('#find-producto-btn').trigger('click');
            },500);
        }else{
            loadStoreProducts();
        }
    DOMEvents();

});

let timeout = null;

const DOMEvents  = () => {
    $('#priceRange').off('change').on('change',function () {
        $('.price-output').val($(this).val());
        loadStoreProducts();
    });

    $('.price-output').off('keyup').on('keyup',function () {
        if($(this).val() > 999){
            $(this).val(999);
        }else if ($(this).val() < 0){
            $(this).val(0);
        }
        $('#priceRange').val($(this).val());

        if(timeout){
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                loadStoreProducts();
            }, 500);
        }else {
            timeout = setTimeout(() => {
                loadStoreProducts();
            }, 500);
        }
    });

    $('.quantity-filter').off('change').on('change',function () {
        loadStoreProducts();
    });

    $(document).on('click','.button-pagination',function () {
        const index = Number($(this).data('index')) || 0;
        changePage(index);
        changeNavigationButtons(index);
    });

    $('#find-producto-btn').off('click').on('click',function () {
        loadStoreProducts().then(() => {
            loader.hide();
        });
    });

    $(document).on('click','.category-checkbox',function (e) {
        loadStoreProducts();
    });
    $(document).on('click','.brand-checkbox',function (e) {
        loadStoreProducts();
    });
}

const loadStoreProducts = async () => {
    loader.show();
    const pageCount = $('.quantity-filter').val();
    const price = Number($('.price-output').val() || 0);
    const productName = $('#find-producto').val() || '';
    let categorias = $('.category-checkbox:checked').get().map((e) => $(e).val()).join(',');
    let marcas = $('.brand-checkbox:checked').get().map((e) => $(e).val()).join(',');

    const response = await HTTPRequest.callProcedure('http://ferreriwork.com:8081/backend/api/procedure',
        {
            "procedure": "{ CALL base.SP_FW_CONSULTAR_STORE(?,?,?,?,?) }",
            "params": [1, categorias, marcas, price, productName]

        });
    const storeProducts = document.querySelector('.store-products');
    storeProducts.innerHTML = '';
    $('.store-pagination').html();
    currentPage = 0;
    batchedData = [];
    if(response.data.length > 0) {

        $('.total-quantity').text(response.data.length);
        const countOfPages = Math.ceil(response.data.length / pageCount);

        for(let i = 0; i < countOfPages; i++){
            batchedData[i] = response.data.slice(i * pageCount, (i + 1) * pageCount);
        }

        let html = "";

        html = '<li class="backward"><button data-index="-1" class="button-pagination"><i class="fa fa-backward" aria-hidden="true"></i></button></li>';

        html += batchedData.map((data,index) => {
            return /*html*/`
            <li><button data-index="${index}" class="button-pagination ${index === 0 ? 'active' : ''}">${index+1}</button></li>
            `;
        }).join('');

        html += '<li class="forward"><button data-index="'+(countOfPages-1)+'" class="button-pagination"><i class="fa fa-forward" aria-hidden="true"></i></button></li>';

        $('.store-pagination').html(html);
        $('.max-quantity').text(batchedData[0].length);
        $('.current-quantity').text(1);

        batchedData[0].forEach(producto => {
            storeProducts.innerHTML += storeCardProduct(producto);
        });

        changeNavigationButtons(0);
    }else{
        $('.store-pagination').html("");
        $('.max-quantity').text(0);
        $('.current-quantity').text(0);
        $('.total-quantity').text(0);
    }
    loader.hide();
}

const changeNavigationButtons = (idx) => {

    const index = idx == -1 ? 0 : idx;
    $('.store-pagination li').css('display','none');
    $('.button-pagination').removeClass('active');
    $(`.button-pagination[data-index="${index}"]`).each( (i,e) => {
        const selected = $(e).closest('li');
        selected.css('display','inline-block');
        $(e).addClass('active');
        const next2 = selected.nextAll().slice(0,2);
        const prev2 = selected.prevAll().slice(0,2);

        const hasmoreNext  = selected.nextAll().length > 3;
        const hasmorePrev  = selected.prevAll().length > 3;

        next2.css('display','inline-block');
        prev2.css('display','inline-block');


        if(!hasmoreNext){
            $('.forward').css('display','none');
        }else{
            $('.forward').css('display','inline-block');
        }

        if(!hasmorePrev){
            $('.backward').css('display','none');
        }else{
            $('.backward').css('display','inline-block');
        }

    });


}

const changePage = (idx) => {

    const page = idx == -1 ? 0 : idx;

    const storeProducts = document.querySelector('.store-products');
    storeProducts.innerHTML = '';
    batchedData[page].forEach(producto => {
        storeProducts.innerHTML += storeCardProduct(producto);
    });
    const pageCount = Number($('.quantity-filter').val()) || 0;
    if(page === 0) {
        $('.max-quantity').text(batchedData[page].length);
        $('.current-quantity').text(1);
    }else{
        $('.max-quantity').text(batchedData[page].length + (pageCount * page));
        $('.current-quantity').text(pageCount*page + 1);
    }

}
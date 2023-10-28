import {HTTPRequest} from "./helper/Ajax.js";

window.addEventListener('load', () => {
    eventos.init();
    session.init();
});

const session = {
    init(){
        this.checkSession();
    },
    checkSession(){
        const usuario = sessionStorage.getItem('usuario');
        if(usuario){
            const usuarioObj = JSON.parse(usuario);
            $('#miSesion').html(usuarioObj.first_name + ' ' + usuarioObj.last_name);
            $('body').on('click', '#miSesion', () => {
                $('#modalPerfil').modal('show');
            });
        }else{
            eventos.openLogin();
        }
    }
}

const eventos = {
    init(){
        this.btnLogin();
    },
    openLogin(){
        $('body').on('click', '#miSesion', () => {
            $('.login-form-wrap').removeClass('hidden');
            $('.register-form-wrap').addClass('hidden');
            $('.modal-login').modal('show');
        });
    },
    btnLogin(){
        $('body').on('click', '#btnEntrar', async() => {
            const loginCorreo = $('#loginCorreo').val() || '';
            const loginPassword = $('#loginPassword').val() || '';
            const response = await HTTPRequest.callProcedure('http://13.59.147.125:8080/api/procedure',
                {
                    procedure: '{ CALL base.SP_FW_LOGIN(?,?,?) }',
                    params: [1, loginCorreo, loginPassword]
                });
            if(response.data.length > 0){
                console.log(response.data[0])
                sessionStorage.setItem('usuario', JSON.stringify(response.data[0]));
                location.reload();
            }
        });
    }
}
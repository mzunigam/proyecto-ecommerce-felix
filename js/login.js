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
            $('body').on('click', '#miSesion', async () => {
                const json = {
                    procedure :"{ CALL base.SP_FW_OBTENER_DATOS_USUARIO(?,?)}",
                    params: [1,Number(usuarioObj.user_id)]
                }
                const response = await HTTPRequest.callProcedure('13.59.147.125:8080/backend/api/procedure',json);
                if(response.status){
                    $('#txtCorreo').val(response.data[0].email);
                    $('#txtNombres').val(response.data[0].first_name);
                    $('#txtApellidos').val(response.data[0].last_name);
                    $('#txtDireccion').val(response.data[0].address);
                    $('#txtTelefono').val(response.data[0].phone);
                    $('#modalPerfil').modal('show');
                }else{
                    toastr["warning"]("No se pudo obtener los datos del usuario", "Error")
                }

            });
        }else{
            eventos.openLogin();
        }
    }
}

const eventos = {
    init(){
        this.btnLogin();
        this.btnGuardarUser();
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
            const response = await HTTPRequest.callProcedure('13.59.147.125:8080/backend/api/procedure',
                {
                    procedure: '{ CALL base.SP_FW_LOGIN(?,?,?) }',
                    params: [2, loginCorreo, loginPassword]
                });
            if(response.data.length > 0){
                sessionStorage.setItem('usuario', JSON.stringify(response.data[0]));
                location.reload();
            }else{
                toastr["warning"]("El usuario o la contraseña son incorrectos", "Error")
                $('#loginCorreo').addClass('is-invalid');
                $('#loginPassword').addClass('is-invalid');
                setTimeout(()=> {
                    $('#loginCorreo').removeClass('is-invalid');
                    $('#loginPassword').removeClass('is-invalid');
                },5000)
            }
        });
    },
    btnGuardarUser(){
        $('.btn-guardar-user').on('click', async () => {
            const txtCorreo = $('#txtCorreo').val() || '';
            const txtNombres = $('#txtNombres').val() || '';
            const txtApellidos = $('#txtApellidos').val() || '';
            const txtDireccion = $('#txtDireccion').val() || '';
            const txtTelefono = $('#txtTelefono').val() || '';
            const usuario = sessionStorage.getItem('usuario');
            const usuarioObj = JSON.parse(usuario);
            const json = {
                procedure :"{ CALL base.SP_FW_MODIFICAR_USUARIO(?,?,?,?,?,?,?,?) }",
                params: [1,Number(usuarioObj.user_id),txtNombres,txtApellidos,txtCorreo,'',txtDireccion,txtTelefono]
            }
            const response = await HTTPRequest.callProcedure('13.59.147.125:8080/backend/api/procedure',json);
            console.log(response);
            if(response.status){
                toastr["success"]("Se modificó correctamente el usuario", "Correcto")
                $('#modalPerfil').modal('hide');
                setTimeout(()=> {
                    window.location.reload();
                },500);
            }
        });
    }
}
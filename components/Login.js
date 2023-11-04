class LoginComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*html*/ `
        
        <div class="modal modal-login fade">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
                <div class="modal-body">
                    <div class="login-form-wrap loginForm w-100">
                        <div class="title-wrap text-center">
                            <h2 class="h1-style">Unete ya</h2>
                            <div class="h-sub w-800">Ingresa a nuestra tienda y empieza a comprar ahora</div>
                            <br>
                        </div>
                        <div class="form-group">
                            <label for="loginCorreo">
                                Correo
                            </label>
                            <div class="form-control-wrap">
                                <input type="email" name="customer[email]" id="loginCorreo" autocomplete="email" autocorrect="off" autocapitalize="off" placeholder="Ingresar Tu Correo" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">
                                Contraseña
                            </label>
                            <div class="form-control-wrap">
                                <input type="password" value="" minlength="5" id="loginPassword" autocomplete="current-password" placeholder="******" class="form-control">
                            </div>
                        </div>
                        <div class="mt-5"></div>
                        <button id="btnEntrar" class="btn w-100 btn-login">Entrar</button>
                        <div class="text-center" style="margin-top:1rem;">
                            <a href="#" class="js-toggle-forms" data-form="passwordForm">¿Olvidaste tu contraseña?</a>
                        </div>
                        <div class="text-center" style="margin-top:1rem;">
                            ¿No tienes una cuenta aún?
                            <a href="#" id="openRegister">Registrate Aqui</a>
                        </div>
                    </div>
                    <div class="register-form-wrap registerForm w-100 hidden">
                        <div class="title-wrap text-center">
                            <h2 class="h1-style">Registrate Ya</h2>
                            <div class="h-sub w-800">Registrate a nuestra tienda y empieza a comprar ahora</div>
                            <br>
                        </div>
                        <div class="form-group">
                            <label for="registerNombres">
                                Nombres
                            </label>
                            <div class="form-control-wrap">
                                <input type="text" id="registerNombres" autocorrect="off" autocapitalize="off" placeholder="Tu nombre aquí" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerApellidos">
                                Apellidos
                            </label>
                            <div class="form-control-wrap">
                                <input type="password" value="" minlength="5" id="registerApellidos" autocomplete="current-password" placeholder="Tu apellido aquí" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerCorreo">
                                Correo
                            </label>
                            <div class="form-control-wrap">
                                <input type="email" name="customer[email]" id="registerCorreo" autocomplete="email" autocorrect="off" autocapitalize="off" placeholder="Enter Your Email Here" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">
                                Contraseña
                            </label>
                            <div class="form-control-wrap">
                                <input type="password" value="" minlength="5" id="registerPassword" autocomplete="current-password" placeholder="******" class="form-control">
                            </div>
                        </div>
                        <div class="mt-5"></div>
                        <button id="btnRegistrar" class="btn w-100 btn-login">Regitrarse</button>
                        <div class="text-center" style="margin-top:1rem;">
                            ¿Ya tienes una Cuenta?
                            <a href="#" id="openLogin">Ingresa aquí</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        `;

        document.getElementById('openLogin').addEventListener('click', () => {
            document.querySelector('.loginForm').classList.remove('hidden');
            document.querySelector('.registerForm').classList.add('hidden');
        });

        document.getElementById('openRegister').addEventListener('click', () => {
            document.querySelector('.loginForm').classList.add('hidden');
            document.querySelector('.registerForm').classList.remove('hidden');
        });

        document.querySelector('.modal-login').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                // document.querySelector('.modal-login').classList.add('hidden');
            }
        });

    }
}

customElements.define('login-component', LoginComponent);
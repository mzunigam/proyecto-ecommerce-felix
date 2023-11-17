class Navbar extends HTMLElement{
    connectedCallback() {
        //language=HTML
        this.innerHTML = /*html*/ `
            <div id="top-header">
                <div class="container d-flex justify-content-between">
                    <ul class="header-links  pull-left">
                        <li><a href="#"><i class="fa fa-phone"></i> +51 000000000</a></li>
                        <li><a href="#"><i class="fa fa-envelope-o"></i> correo@dominio.com</a></li>
                        <li><a href="#"><i class="fa fa-map-marker"></i> Direccion de Perú</a></li>
                    </ul>
                    <ul class="header-links  pull-right">
                        <li id="miSesion" style="color: white;"><a href="#"><i class="fa fa-user-o"></i> Ingresar /
                            Registrate</a></li>
                    </ul>
                </div>
            </div>
            <!-- MAIN HEADER -->
            <div id="header">
                <!-- container -->
                <div class="container">
                    <!-- row -->
                    <div class="row">
                        <!-- LOGO -->
                        <div class="col-md-3">
                            <div class="header-logo">
                                <a href="#" class="logo">
                                    <img src="./img/logo.png" alt="">
                                    <span>FerriWork</span>
                                </a>
                            </div>
                        </div>
                        <!-- /LOGO -->

                        <!-- SEARCH BAR -->
                        <div class="col-md-6">
                            <div class="header-search">
                                <form>
                                    <select class="input-select search-category">
                                    </select>
                                    <input class="input search" placeholder="Busca Aquí">
                                    <button class="search-btn">Buscar</button>
                                </form>
                            </div>
                        </div>
                        <!-- /SEARCH BAR -->

                        <!-- ACCOUNT -->
                        <div class="col-md-3 clearfix">
                            <div class="header-ctn">
                                <!-- Wishlist -->
                                <!-- <div>
                                    <a href="#">
                                        <i class="fa fa-heart-o"></i>
                                        <span>Your Wishlist</span>
                                        <div class="qty">2</div>
                                    </a>
                                </div> -->
                                <!-- /Wishlist -->

                                <!-- Cart -->
                                <div class="dropdown">
                                    <a class="dropdown-toggle" id="dropdown-toggle" data-toggle="dropdown"
                                       aria-expanded="true">
                                        <i class="fa fa-shopping-cart"></i>
                                        <span>Mi Carrito</span>
                                        <div class="qty">0</div>
                                    </a>
                                    <div class="cart-dropdown">
                                        <div class="cart-list">
                                        </div>
                                        <div class="cart-summary">
                                            <small></small>
                                            <h5></h5>
                                        </div>
                                        <div class="cart-btns">
                                            <button class="remove-carrito">Limpiar Carrito</button>
                                            <button id="btnComprar">Comprar <i class="fa fa-arrow-circle-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- /Cart -->

                                <!-- Menu Toogle -->
                                <div class="menu-toggle">
                                    <a href="#">
                                        <i class="fa fa-bars"></i>
                                        <span>Menu</span>
                                    </a>
                                </div>
                                <!-- /Menu Toogle -->
                            </div>
                        </div>
                        <!-- /ACCOUNT -->
                    </div>
                    <!-- row -->
                </div>
                <!-- container -->
            </div>
            <!-- /MAIN HEADER -->`;
    }
}

customElements.define('navbar-component', Navbar);
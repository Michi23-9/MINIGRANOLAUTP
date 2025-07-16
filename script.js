document.addEventListener('DOMContentLoaded', () => {
  // Asigna la clave pública de Culqi (ENVÍO DE PAGOS)
    Culqi.publicKey = 'pk_test_eb16955d4d3abdf7'; // Cambia a producción cuando sea necesario

    // ----------- CARRITO DE COMPRAS CON LOCALSTORAGE -----------
    
    let carrito = JSON.parse(localStorage.getItem('carritoMinigranola')) || [];

    // ----------- SELECTORES DEL CARRITO -----------
     const btnCarrito      = document.getElementById('btn-carrito');         // Botón para abrir carrito
    const carritoOffcanvas= document.getElementById('carrito-offcanvas');   // Sidebar del carrito
    const cerrarCarrito   = document.getElementById('cerrar-carrito');      // Botón cerrar carrito
    const carritoBody     = document.getElementById('carrito-body');        // Contenedor de los productos en el carrito
    const contadorCarrito = document.getElementById('contador-carrito');    // Cuenta la cantidad de productos
    const carritoTotal    = document.getElementById('carrito-total');       // Muestra el total de la compra
    const btnComprar      = document.getElementById('btn-comprar');         // Botón para pagar

    // Modal gracias compra (Culqi)
    const modalGracias = document.getElementById('modal-gracias'); // Usamos el elemento existente en el HTML si lo hay, o lo creamos si no
    if (!modalGracias) { // Si no existe en el HTML, lo creamos dinámicamente como en tu código original
        const tempModalGracias = document.createElement('div');
        tempModalGracias.id = 'modal-gracias';
        tempModalGracias.style.cssText = `
            display:none;
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #4caf50; color: white; padding: 2rem 3rem;
            border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-size: 1.5rem; z-index: 11000; text-align: center;
        `;
        tempModalGracias.textContent = '🎉 ¡Gracias por tu compra en MINIGRANOLA! 🎉';
        document.body.appendChild(tempModalGracias);
    }

    // Selectores para el menú hamburguesa (aseguramos que existan)
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('.menu');

    // ----------- ABRIR/CERRAR CARRITO -----------
    if (btnCarrito && carritoOffcanvas && cerrarCarrito) {
        btnCarrito.addEventListener('click', () => {
            carritoOffcanvas.classList.add('activo');
            carritoOffcanvas.setAttribute('aria-hidden', 'false');
        });
        cerrarCarrito.addEventListener('click', () => {
            carritoOffcanvas.classList.remove('activo');
            carritoOffcanvas.setAttribute('aria-hidden', 'true');
        });
    }

    // ----------- FUNCIONES DEL CARRITO -----------
    function actualizarCarrito() {
        carritoBody.innerHTML = '';
        if (carrito.length === 0) {
            carritoBody.innerHTML = '<p class="carrito-vacio">El carrito está vacío.</p>';
        } else {
            carrito.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'carrito-item';
               // Crea cada producto en el carrito (con imagen, nombre, precio, cantidad y eliminar)
                // ¡IMPORTANTE! HTML correctamente envuelto en comillas inversas (` `)
                div.innerHTML = `
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="carrito-item-info">
                        <div class="carrito-item-titulo">${item.nombre}</div>
                        <div class="carrito-item-precio">$${item.precio.toFixed(2)}</div>
                        <div class="carrito-item-cantidad">
                            <button onclick="cambiarCantidad(${index}, -1)">-</button>
                            <input type="number" value="${item.cantidad}" min="1" onchange="cambiarCantidadInput(${index}, this.value)">
                            <button onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                        <div class="carrito-item-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</div>
                    </div>
                `;
                carritoBody.appendChild(div);
            });
        }
        contadorCarrito.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        carritoTotal.textContent = `$${total.toFixed(2)}`;
        localStorage.setItem('carritoMinigranola', JSON.stringify(carrito));
    }
//modificar  cantidad  usamos funciones usamos i
    window.cambiarCantidad = function(index, cambio) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
        actualizarCarrito();
    };

    window.cambiarCantidadInput = function(index, valor) {
        carrito[index].cantidad = Math.max(1, parseInt(valor) || 1);
        actualizarCarrito();
    };

    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        actualizarCarrito();
    };

    function agregarAlCarrito(nombre, precio, imagen) {
        const productoExistente = carrito.find(item => item.nombre === nombre);
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({ nombre, precio, imagen, cantidad: 1 });
        }
        actualizarCarrito();
        carritoOffcanvas.classList.add('activo');
        carritoOffcanvas.setAttribute('aria-hidden', 'false');
    }

    // ----------- BOTONES AÑADIR AL CARRITO -----------
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', () => {
            const producto = boton.closest('.producto');
            if (!producto) return;

            let nombre = producto.querySelector('h4')?.textContent || '';
            if (nombre === 'Smoothie frutal') {
                const fruta = producto.querySelector('.smoothie-fruta')?.value || '';
                nombre = `Smoothie de ${fruta}`;
            }

            const precioText = producto.querySelector('.precio')?.textContent || '';
            const precio = parseFloat(precioText.replace('$', ''));

            const imagen = producto.querySelector('img')?.src || '';
            if (nombre && !isNaN(precio)) {
                agregarAlCarrito(nombre, precio, imagen);
            }
        });
    });

    // Función para obtener el total del carrito (necesaria para Culqi)
    function obtenerTotalCarrito() {
        return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    }

    // ----------- LÓGICA DE COMPRA (CULQI) -----------
    if (btnComprar) {
        btnComprar.addEventListener('click', (e) => {
            e.preventDefault(); // Evita el comportamiento por defecto si btnComprar es un enlace

            if (carrito.length === 0) {
                alert('El carrito está vacío.');
                return;
            }

            const totalSoles = obtenerTotalCarrito();
            const totalCulqi = Math.round(totalSoles * 100); // Culqi espera el monto en céntimos

            Culqi.settings({
                title: 'MINIGRANOLA',
                currency: 'PEN',
                amount: totalCulqi,
                description: 'Compra MINIGRANOLA',
                paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    bancaMovil: true,
                    agente: true,
                    billetera: true,
                    cuotealo: true,
                },
                style: {
                    logo: "https://static.culqi.com/v2/v2/static/img/logo.png",
                }
            });
            Culqi.open();
        });
    }

    // Función que Culqi llama cuando crea token (requerida por Culqi)
    window.culqi = function() {
        if (Culqi.token) {
            // alert('Pago realizado con éxito // Puedes quitar esto para producción
            lanzarConfeti(); // Lanza confeti al éxito
            const modalGraciasEl = document.getElementById('modal-gracias');
            if (modalGraciasEl) {
                modalGraciasEl.style.display = 'block';
                modalGraciasEl.style.opacity = '1';
                setTimeout(() => {
                    modalGraciasEl.style.opacity = '0';
                    setTimeout(() => {
                        modalGraciasEl.style.display = 'none';
                    }, 500);
                }, 5000);
            }

            carrito = []; // Vacía el carrito después de una compra exitosa
            actualizarCarrito();
            carritoOffcanvas.classList.remove('activo');
            carritoOffcanvas.setAttribute('aria-hidden', 'true');
        } else if (Culqi.error) {
            alert('Error en el pago: ' + Culqi.error.user_message);
        }
    };


    // ----------- EFECTO CONFETI (MOVIDO A UNA FUNCIÓN PARA SER LLAMADO POR CULQI) -----------
    // Asegúrate de tener la librería de confeti cargada en tu HTML (ej: <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>)
    function lanzarConfeti() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // ----------- MENÚ HAMBURGUESA -----------
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('activo');
        });
    }

    // ----------- CAMBIO DE COLOR NAV AL SCROLL -----------
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // ----------- ACORDEÓN RECETAS -----------
  document.querySelectorAll('.acordeon-btn').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Cierra todos los demás acordeones
        document.querySelectorAll('.acordeon-content').forEach(panel => {
            if (panel !== content) {
                panel.style.maxHeight = null;
                panel.previousElementSibling.setAttribute('aria-expanded', 'false');
            }
        });

        // Abre o cierra el acordeón clickeado
        if (isExpanded) {
            content.style.maxHeight = null;
            button.setAttribute('aria-expanded', 'false');
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            button.setAttribute('aria-expanded', 'true');
        }
    });
});
    


    // ----------- INICIALIZACIÓN -----------
    actualizarCarrito(); // Asegura que el carrito se cargue al inicio
});
// Obtiene todos los elementos relevantes del DOM usando sus IDs
const chatbotBtn = document.getElementById('chatbot-btn');           // Botón para abrir/cerrar el chatbot
const chatbotModal = document.getElementById('chatbot-modal');       // Ventana modal que muestra el chatbot
const cerrarChatbot = document.getElementById('cerrar-chatbot');     // Botón para cerrar el chatbot
const chatbotBody = document.getElementById('chatbot-body');         // Contenedor donde se muestran todos los mensajes
const chatbotInput = document.getElementById('chatbot-input');       // Campo de texto para escribir los mensajes
const enviarChatbot = document.getElementById('enviar-chatbot');     // Botón para enviar los mensajes

// Verifica que todos los elementos existen antes de agregarles funcionalidad
    if (chatbotBtn && chatbotModal && cerrarChatbot && chatbotBody && chatbotInput && enviarChatbot) {

          // Al hacer clic en el botón se muestra/oculta la ventana del chatbot
        chatbotBtn.addEventListener('click', () => {
            chatbotModal.classList.toggle('activo');// Muestra/oculta el modal alternando la clase "activo"
            chatbotModal.setAttribute('aria-hidden', chatbotModal.classList.contains('activo') ? 'false' : 'true');
            if (chatbotModal.classList.contains('activo')) {
                chatbotInput.focus();// Si se abre, pone el cursor en el input
            }
        });
 // Al hacer clic en el botón de cerrar, se oculta el modal
        cerrarChatbot.addEventListener('click', () => {
            chatbotModal.classList.remove('activo');// Oculta el modal
            chatbotModal.setAttribute('aria-hidden', 'true');// Atributo para accesibilidad
        });

        function enviarMensajeChatbot(mensaje) {
            const mensajeUsuario = document.createElement('p');
            mensajeUsuario.textContent = mensaje;
            mensajeUsuario.style.textAlign = 'right';
            mensajeUsuario.style.margin = '0.5rem 0';
            chatbotBody.appendChild(mensajeUsuario);

            setTimeout(() => {
                const respuesta = document.createElement('p');// Crea el elemento <p> para la respuesta
                respuesta.style.textAlign = 'left';
                // La respuesta va a la izquierda
                respuesta.style.margin = '0.5rem 0';

                const msg = mensaje.toLowerCase();  // Convierte tu mensaje a minúsculas
 // Múltiples respuestas automáticas según palabras que contiene tu mensaje
                if (msg.includes('hola') || msg.includes('buenos días') || msg.includes('buenas tardes')) {
                    respuesta.textContent = '¡Hola! ¿En qué puedo ayudarte?';
                } else if (msg.includes('productos') || msg.includes('snacks') || msg.includes('bebidas')) {
                    respuesta.textContent = 'Tenemos snacks saludables, bebidas naturales y postres deliciosos. ¿Quieres que te recomiende alguno?';
                } else if (msg.includes('precio') || msg.includes('costar') || msg.includes('cuesta')) {
                    respuesta.textContent = 'Los precios varían según el producto, desde $1.50 hasta $2.90. ¿Quieres ver nuestra sección de productos?';
                } else if (msg.includes('promociones') || msg.includes('descuento') || msg.includes('oferta')) {
                    respuesta.textContent = 'Actualmente tenemos combos especiales y descuentos para nuevos usuarios. ¡Échales un vistazo en la sección de Promociones!';
                } else if (msg.includes('registro') || msg.includes('registrarse') || msg.includes('cuenta')) {
                    respuesta.textContent = 'Puedes registrarte para obtener descuentos exclusivos y seguir tus pedidos. Visita la sección Registro para más información.';
                } else if (msg.includes('nosotros') || msg.includes('quiénes somos') || msg.includes('equipo')) {
                    respuesta.textContent = 'Somos MINIGRANOLA, comprometidos con la alimentación saludable y el bienestar de nuestros clientes.';
                } else if (msg.includes('gracias')) {
                    respuesta.textContent = '¡De nada! Si tienes más preguntas, aquí estaré para ayudarte.';
                } else {
                    respuesta.textContent = 'Gracias por tu mensaje. ¿En qué más puedo ayudarte?';
                }

                chatbotBody.appendChild(respuesta);// Muestra la respuesta del bot en el chat
                chatbotBody.scrollTop = chatbotBody.scrollHeight;// Hace scroll hacia el último mensaje
            }, 600);// Espera 600 ms antes de responder
        }

        
        
         // Al hacer clic en el botón enviar, se manda el mensaje si no está vacío
         enviarChatbot.addEventListener('click', () => {
            if (chatbotInput.value.trim() !== '') {
                enviarMensajeChatbot(chatbotInput.value);// Envía el mensaje
                chatbotInput.value = ''; // Borra el texto del input
            }
        });
// Al pulsar Enter en el input, también se manda el mensaje si no está vacío
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatbotInput.value.trim() !== '') {
                enviarMensajeChatbot(chatbotInput.value); //Envia el mensaje
                chatbotInput.value = ''; //Borra el texto
            }
        });
    }

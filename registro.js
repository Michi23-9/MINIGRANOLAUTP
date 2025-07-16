
// ----------- FORMULARIO DE REGISTRO -----------
const formRegistro = document.getElementById('formRegistro'); // Obtiene el formulario por su ID

if (formRegistro) { // Verifica que el formulario exista en el DOM
  formRegistro.addEventListener('submit', function(e) { // Evento al enviar el formulario
    e.preventDefault(); // Evita que la página se recargue
    const nombre = document.getElementById('nombre').value; // Obtiene el valor del campo de nombre
    document.getElementById('mensaje').textContent = `¡Gracias, ${nombre}! Te has registrado correctamente.`; // Muestra mensaje de éxito usando el nombre ingresado
    formRegistro.reset(); // Limpia el formulario después de enviar
  });
}

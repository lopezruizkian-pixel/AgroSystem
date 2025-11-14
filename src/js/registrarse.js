// Obtener elementos del DOM
const formRegistro = document.getElementById('formRegistro');
const togglePassword = document.getElementById('togglePassword');
const inputContrasena = document.getElementById('contrasena');

// Toggle para mostrar/ocultar contraseña
togglePassword.addEventListener('click', () => {
    const tipo = inputContrasena.type === 'password' ? 'text' : 'password';
    inputContrasena.type = tipo;
    togglePassword.textContent = tipo === 'password' ? '👁️' : '👁️‍🗨️';
});

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    // Crear nuevo mensaje
    const div = document.createElement('div');
    div.className = `mensaje ${tipo}`;
    div.textContent = mensaje;
    
    // Insertar antes del formulario
    formRegistro.parentNode.insertBefore(div, formRegistro);
    div.style.display = 'block';

    // Ocultar después de 5 segundos
    setTimeout(() => {
        div.style.display = 'none';
    }, 5000);
}

// Función para validar el formulario
function validarFormulario(datos) {
    if (datos.cargo === '') {
        mostrarMensaje('Por favor selecciona un cargo', 'error');
        return false;
    }

    if (datos.nombreCompleto.trim().length < 3) {
        mostrarMensaje('El nombre debe tener al menos 3 caracteres', 'error');
        return false;
    }

    if (datos.usuario.trim().length < 4) {
        mostrarMensaje('El usuario debe tener al menos 4 caracteres', 'error');
        return false;
    }

    if (datos.contrasena.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }

    if (datos.telefono.trim().length < 10) {
        mostrarMensaje('Por favor ingresa un teléfono válido', 'error');
        return false;
    }

    return true;
}

// Función para guardar usuario
function guardarUsuario(usuario) {
    // Obtener usuarios existentes del localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar si el usuario ya existe
    const usuarioExiste = usuarios.some(u => u.usuario === usuario.usuario);
    if (usuarioExiste) {
        mostrarMensaje('Este nombre de usuario ya está registrado', 'error');
        return false;
    }

    // Agregar nuevo usuario
    usuarios.push(usuario);

    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    return true;
}

// Manejar el envío del formulario
formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener datos del formulario
    const datosFormulario = {
        cargo: document.getElementById('cargo').value,
        nombreCompleto: document.getElementById('nombreCompleto').value,
        usuario: document.getElementById('usuario').value,
        contrasena: document.getElementById('contrasena').value,
        telefono: document.getElementById('telefono').value,
        fechaRegistro: new Date().toISOString()
    };

    // Validar formulario
    if (!validarFormulario(datosFormulario)) {
        return;
    }

    // Intentar guardar usuario
    if (guardarUsuario(datosFormulario)) {
        mostrarMensaje('¡Registro exitoso! Redirigiendo al login...', 'exito');
        
        // Limpiar formulario
        formRegistro.reset();

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 2000);
    }
});

// Validación en tiempo real del usuario (opcional)
document.getElementById('usuario').addEventListener('blur', function() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExiste = usuarios.some(u => u.usuario === this.value);
    
    if (usuarioExiste && this.value.trim() !== '') {
        mostrarMensaje('Este usuario ya está en uso', 'error');
        this.focus();
    }
});

// Formatear teléfono mientras se escribe (opcional)
document.getElementById('telefono').addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 10) {
        valor = valor.substring(0, 10);
    }
    e.target.value = valor;
});
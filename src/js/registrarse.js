const formRegistro = document.getElementById('formRegistro');
const togglePassword = document.getElementById('togglePassword');
const inputContrasena = document.getElementById('contrasena');

togglePassword.addEventListener('click', () => {
    const tipo = inputContrasena.type === 'password' ? 'text' : 'password';
    inputContrasena.type = tipo;
    togglePassword.textContent = tipo === 'password' ? '👁️' : '👁️‍🗨️';
});

function mostrarMensaje(mensaje, tipo) {
    const mensajeAnterior = document.querySelector('.mensaje');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    const div = document.createElement('div');
    div.className = `mensaje ${tipo}`;
    div.textContent = mensaje;
    
    formRegistro.parentNode.insertBefore(div, formRegistro);
    div.style.display = 'block';

    setTimeout(() => {
        div.style.display = 'none';
    }, 5000);
}

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

function guardarUsuario(usuario) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioExiste = usuarios.some(u => u.usuario === usuario.usuario);
    if (usuarioExiste) {
        mostrarMensaje('Este nombre de usuario ya está registrado', 'error');
        return false;
    }

    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    return true;
}

formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    const datosFormulario = {
        cargo: document.getElementById('cargo').value,
        nombreCompleto: document.getElementById('nombreCompleto').value,
        usuario: document.getElementById('usuario').value,
        contrasena: document.getElementById('contrasena').value,
        telefono: document.getElementById('telefono').value,
        fechaRegistro: new Date().toISOString()
    };

    if (!validarFormulario(datosFormulario)) {
        return;
    }

    if (guardarUsuario(datosFormulario)) {
        mostrarMensaje('¡Registro exitoso! Iniciando sesión...', 'exito');
        
        // Iniciar sesión automáticamente
        const datosUsuario = {
            usuario: datosFormulario.usuario,
            rol: datosFormulario.cargo,
            nombreCompleto: datosFormulario.nombreCompleto,
            telefono: datosFormulario.telefono,
            fechaLogin: new Date().toISOString()
        };
        
        localStorage.setItem('usuarioAgroSystem', datosFormulario.usuario);
        localStorage.setItem('datosUsuarioAgroSystem', JSON.stringify(datosUsuario));
        
        formRegistro.reset();

        setTimeout(() => {
            window.location.href = '../pages/home.html';
        }, 2000);
    }
});

document.getElementById('usuario').addEventListener('blur', function() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExiste = usuarios.some(u => u.usuario === this.value);
    
    if (usuarioExiste && this.value.trim() !== '') {
        mostrarMensaje('Este usuario ya está en uso', 'error');
        this.focus();
    }
});

document.getElementById('telefono').addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 10) {
        valor = valor.substring(0, 10);
    }
    e.target.value = valor;
});
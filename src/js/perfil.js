const usuarioGuardado = localStorage.getItem('usuarioAgroSystem');
if (!usuarioGuardado) {
    window.location.href = '../../index.html';
}

// Cargar datos del usuario
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosUsuario();
});

function cargarDatosUsuario() {
    const datosUsuario = JSON.parse(localStorage.getItem('datosUsuarioAgroSystem'));
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (datosUsuario) {
        // Buscar información completa del usuario
        let infoCompleta = datosUsuario;
        
        if (datosUsuario.rol !== 'admin') {
            const usuarioRegistrado = usuarios.find(u => u.usuario === datosUsuario.usuario);
            if (usuarioRegistrado) {
                infoCompleta = {
                    ...datosUsuario,
                    fechaRegistro: usuarioRegistrado.fechaRegistro
                };
            }
        }
        
        // Actualizar el DOM
        document.getElementById('nombreUsuario').textContent = infoCompleta.nombreCompleto;
        document.getElementById('rolUsuario').textContent = infoCompleta.rol === 'admin' ? 'Administrador' : capitalize(infoCompleta.rol);
        document.getElementById('nombreCompleto').textContent = infoCompleta.nombreCompleto;
        document.getElementById('usuario').textContent = infoCompleta.usuario;
        document.getElementById('cargo').textContent = infoCompleta.rol === 'admin' ? 'Administrador' : capitalize(infoCompleta.rol);
        document.getElementById('telefono').textContent = infoCompleta.telefono || 'No especificado';
        
        // Formatear fecha de registro
        if (infoCompleta.fechaRegistro) {
            const fechaReg = new Date(infoCompleta.fechaRegistro);
            document.getElementById('fechaRegistro').textContent = formatearFecha(fechaReg);
        } else {
            document.getElementById('fechaRegistro').textContent = 'No disponible';
        }
        
        // Formatear último acceso
        if (infoCompleta.fechaLogin) {
            const fechaLogin = new Date(infoCompleta.fechaLogin);
            document.getElementById('ultimoAcceso').textContent = formatearFechaHora(fechaLogin);
        } else {
            document.getElementById('ultimoAcceso').textContent = 'Ahora';
        }
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function formatearFechaHora(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function volverHome() {
    window.location.href = './home.html';
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('usuarioAgroSystem');
        localStorage.removeItem('datosUsuarioAgroSystem');
        window.location.href = '../../index.html';
    }
}
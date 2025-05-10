// Configuração das partículas
particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        color: { value: "#8a2be2" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: { enable: true, distance: 150 }
    }
});

// Sistema de login com Discord (simulação)
document.getElementById('discord-login').addEventListener('click', function() {
    // Simulação de dados do usuário
    const user = {
        username: "UsuarioExemplo",
        avatar: "https://cdn.discordapp.com/embed/avatars/0.png"
    };
    
    // Mostrar perfil
    document.getElementById('profile-avatar').src = user.avatar;
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
    
    // Salvar no localStorage
    localStorage.setItem('lunaHubUser', JSON.stringify(user));
});

// Botão de logout
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('lunaHubUser');
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('profile-section').style.display = 'none';
});

// Verificar se já está logado ao carregar
window.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('lunaHubUser');
    if (user) {
        const userData = JSON.parse(user);
        document.getElementById('profile-avatar').src = userData.avatar;
        document.getElementById('profile-username').textContent = userData.username;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('profile-section').style.display = 'block';
    }
});

// Rolagem suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

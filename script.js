// Verifica o status de login
async function checkAuth() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            showUserProfile(user);
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
    }
}

// Mostra o perfil do usuário
function showUserProfile(user) {
    document.getElementById('profile-avatar').src = 
        user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'assets/default-avatar.png';
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-discriminator').textContent = `#${user.discriminator}`;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
}

// Event Listeners
document.getElementById('discord-login').addEventListener('click', () => {
    window.location.href = '/auth/discord';
});

document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.href = '/logout';
});

// Inicialização
document.addEventListener('DOMContentLoaded', checkAuth);

// Configuração do Discord OAuth
const DISCORD_CLIENT_ID = 'SEU_CLIENT_ID_AQUI';
const DISCORD_REDIRECT_URI = encodeURIComponent('https://seusite.com/auth/callback');
const DISCORD_SCOPE = encodeURIComponent('identify email');

document.getElementById('discord-login').addEventListener('click', () => {
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&response_type=code&scope=${DISCORD_SCOPE}`;
});

// Gerenciamento de sessão
function checkAuth() {
    const userData = localStorage.getItem('lunaHubUser');
    if (userData) {
        const user = JSON.parse(userData);
        displayUserProfile(user);
    }
}

function displayUserProfile(user) {
    document.getElementById('profile-avatar').src = user.avatar || 'assets/images/default-avatar.png';
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-discriminator').textContent = `#${user.discriminator}`;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
}

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('lunaHubUser');
    window.location.reload();
});

// Inicialização
window.addEventListener('DOMContentLoaded', checkAuth);

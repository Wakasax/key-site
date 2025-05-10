document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const profileSection = document.getElementById('profile-section');
    const discordLoginBtn = document.getElementById('discord-login');
    const logoutBtn = document.getElementById('logout-btn');

    // Verifica se o usuário está logado
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
        const avatarUrl = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';

        document.getElementById('profile-avatar').src = avatarUrl;
        document.getElementById('profile-username').textContent = `${user.username}#${user.discriminator}`;
        document.getElementById('profile-email').textContent = user.email || '';

        loginForm.classList.add('hidden');
        profileSection.classList.remove('hidden');
    }

    // Event listeners
    discordLoginBtn.addEventListener('click', () => {
        window.location.href = '/auth/discord';
    });

    logoutBtn.addEventListener('click', () => {
        window.location.href = '/logout';
    });

    // Verifica autenticação ao carregar
    await checkAuth();
});

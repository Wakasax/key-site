// Funções gerais do site
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.previousElementSibling.textContent;
            navigator.clipboard.writeText(code);
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScroll();
    initCopyButtons();
});

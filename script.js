
class FortuneGame {
    constructor() {
        this.balance = 100.00;
        this.currentBet = 10.00;
        this.isSpinning = false;
        this.history = [];
        this.houseEdge = 0.15; // 15% de vantagem da casa
        this.winStreak = 0;
        this.lossStreak = 0;
        
        this.symbols = ['🐅', '💰', '🍀', '💎', '🔥'];
        this.payouts = {
            '🐅🐅🐅': 50,
            '💰💰💰': 25,
            '💎💎💎': 15,
            '🍀🍀🍀': 10,
            '🔥🔥🔥': 5
        };
        
        this.updateDisplay();
        this.loadHistory();
    }
    
    updateDisplay() {
        document.getElementById('balance').textContent = this.balance.toFixed(2);
        document.getElementById('currentBet').textContent = this.currentBet.toFixed(2);
    }
    
    setBet(amount) {
        if (this.isSpinning) return;
        
        this.currentBet = amount;
        
        // Atualizar botões ativos
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.updateDisplay();
    }
    
    calculateWinProbability() {
        // Algoritmo que favorece a casa
        let baseProbability = 0.25; // 25% chance base de ganhar
        
        // Se o jogador está ganhando muito, reduzir probabilidade
        if (this.winStreak >= 2) {
            baseProbability *= 0.3;
        }
        
        // Se o jogador está perdendo muito, aumentar um pouco
        if (this.lossStreak >= 5) {
            baseProbability *= 1.5;
        }
        
        // Reduzir probabilidade baseada na vantagem da casa
        baseProbability *= (1 - this.houseEdge);
        
        // Se a banca está baixa, reduzir ainda mais
        if (this.balance < 20) {
            baseProbability *= 0.5;
        }
        
        return Math.min(baseProbability, 0.35); // Máximo 35% de chance
    }
    
    generateResult() {
        const winProbability = this.calculateWinProbability();
        const isWin = Math.random() < winProbability;
        
        let result = [];
        
        if (isWin) {
            // Gerar combinação vencedora
            const winningCombos = Object.keys(this.payouts);
            const combo = winningCombos[Math.floor(Math.random() * winningCombos.length)];
            result = combo.match(/./gu);
        } else {
            // Gerar combinação perdedora
            do {
                result = [
                    this.symbols[Math.floor(Math.random() * this.symbols.length)],
                    this.symbols[Math.floor(Math.random() * this.symbols.length)],
                    this.symbols[Math.floor(Math.random() * this.symbols.length)]
                ];
            } while (this.isWinningCombination(result));
        }
        
        return result;
    }
    
    isWinningCombination(result) {
        const combo = result.join('');
        return this.payouts.hasOwnProperty(combo);
    }
    
    async spin() {
        if (this.isSpinning || this.balance < this.currentBet) {
            if (this.balance < this.currentBet) {
                this.showNotification('Saldo insuficiente!', 'error');
            }
            return;
        }
        
        this.isSpinning = true;
        this.balance -= this.currentBet;
        this.updateDisplay();
        
        // Atualizar botão de spin
        const spinBtn = document.getElementById('spinBtn');
        spinBtn.disabled = true;
        spinBtn.querySelector('.spin-text').style.display = 'none';
        spinBtn.querySelector('.spin-loader').style.display = 'block';
        
        // Gerar resultado
        const result = this.generateResult();
        
        // Animar roletas
        await this.animateReels(result);
        
        // Verificar vitória
        const isWin = this.isWinningCombination(result);
        let winAmount = 0;
        
        if (isWin) {
            const combo = result.join('');
            const multiplier = this.payouts[combo];
            winAmount = this.currentBet * multiplier;
            this.balance += winAmount;
            this.winStreak++;
            this.lossStreak = 0;
            
            await this.showWinEffects(winAmount);
        } else {
            this.lossStreak++;
            this.winStreak = 0;
        }
        
        // Adicionar ao histórico
        this.addToHistory(result, isWin, winAmount);
        
        // Resetar botão
        spinBtn.disabled = false;
        spinBtn.querySelector('.spin-text').style.display = 'inline';
        spinBtn.querySelector('.spin-loader').style.display = 'none';
        
        this.isSpinning = false;
        this.updateDisplay();
    }
    
    async animateReels(result) {
        const reels = document.querySelectorAll('.reel');
        
        // Adicionar classe de spinning
        reels.forEach(reel => reel.classList.add('spinning'));
        
        // Aguardar animação
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Atualizar símbolos
        reels.forEach((reel, index) => {
            reel.classList.remove('spinning');
            reel.querySelector('.symbol').textContent = result[index];
        });
        
        // Se for vitória, animar símbolos
        if (this.isWinningCombination(result)) {
            reels.forEach(reel => {
                reel.querySelector('.symbol').classList.add('winning');
            });
            
            // Mostrar linha de vitória
            const winLine = document.getElementById('winLine');
            winLine.classList.add('active');
            
            setTimeout(() => {
                winLine.classList.remove('active');
                reels.forEach(reel => {
                    reel.querySelector('.symbol').classList.remove('winning');
                });
            }, 3000);
        }
    }
    
    async showWinEffects(amount) {
        // Mostrar notificação de vitória
        const notification = document.getElementById('winNotification');
        const winAmountSpan = document.getElementById('winAmount');
        
        winAmountSpan.textContent = `R$ ${amount.toFixed(2)}`;
        notification.classList.add('show');
        
        // Criar partículas
        this.createParticles();
        
        // Fechar notificação após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particles = ['🎉', '💰', '🎊', '⭐', '💎'];
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            particlesContainer.appendChild(particle);
            
            // Remover partícula após animação
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 5000);
        }
    }
    
    addToHistory(result, isWin, winAmount) {
        const historyItem = {
            symbols: result.join(' '),
            isWin: isWin,
            amount: isWin ? winAmount : -this.currentBet,
            timestamp: new Date()
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        this.updateHistoryDisplay();
        this.saveHistory();
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            div.innerHTML = `
                <div class="history-symbols">${item.symbols}</div>
                <div class="history-result ${item.isWin ? 'win' : 'lose'}">
                    ${item.amount > 0 ? '+' : ''}R$ ${item.amount.toFixed(2)}
                </div>
            `;
            
            historyList.appendChild(div);
        });
    }
    
    saveHistory() {
        localStorage.setItem('fortuneGameHistory', JSON.stringify(this.history));
        localStorage.setItem('fortuneGameBalance', this.balance.toString());
    }
    
    loadHistory() {
        const savedHistory = localStorage.getItem('fortuneGameHistory');
        const savedBalance = localStorage.getItem('fortuneGameBalance');
        
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistoryDisplay();
        }
        
        if (savedBalance) {
            this.balance = parseFloat(savedBalance);
            this.updateDisplay();
        }
    }
    
    showNotification(message, type = 'info') {
        // Implementar notificação simples
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4757' : '#ffd700'};
            color: #000;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.game = new FortuneGame();
});

// Funções globais para os botões
function setBet(amount) {
    if (window.game) {
        window.game.setBet(amount);
    }
}

function spin() {
    if (window.game) {
        window.game.spin();
    }
}

// Adicionar efeitos visuais extras
document.addEventListener('DOMContentLoaded', () => {
    // Efeito de brilho no cabeçalho
    const header = document.querySelector('header');
    if (header) {
        setInterval(() => {
            header.style.boxShadow = '0 0 ' + (Math.random() * 20 + 10) + 'px rgba(255, 215, 0, 0.3)';
        }, 2000);
    }
    
    // Efeito parallax suave no fundo
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        document.body.style.background = `
            linear-gradient(${135 + mouseX * 10}deg, 
            #1a1a2e 0%, 
            #16213e ${50 + mouseY * 10}%, 
            #0f3460 100%)
        `;
    });
});

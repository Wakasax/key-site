// Estado do jogo
let gameState = {
    balance: 100.00,
    currentBet: 10.00,
    wins: 0,
    streak: 0,
    isSpinning: false,
    history: []
};

// Símbolos do jogo
const symbols = ['🐅', '💰', '💎', '🍀', '🔥'];

// Multiplicadores
const multipliers = {
    '🐅🐅🐅': 50,
    '💰💰💰': 25,
    '💎💎💎': 15,
    '🍀🍀🍀': 10,
    '🔥🔥🔥': 5
};

// Elementos DOM
const balanceElement = document.getElementById('balance');
const currentBetElement = document.getElementById('currentBet');
const winsElement = document.getElementById('wins');
const streakElement = document.getElementById('streak');
const spinBtn = document.getElementById('spinBtn');
const historyList = document.getElementById('historyList');
const winNotification = document.getElementById('winNotification');
const winAmount = document.getElementById('winAmount');

// Inicializar jogo
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    generateInitialHistory();
});

// Função para girar os rolos
function spin() {
    if (gameState.isSpinning || gameState.balance < gameState.currentBet) {
        return;
    }

    gameState.isSpinning = true;
    gameState.balance -= gameState.currentBet;

    // Atualizar interface
    spinBtn.disabled = true;
    spinBtn.querySelector('.play-text').style.display = 'none';
    spinBtn.querySelector('.play-loader').style.display = 'inline-block';

    // Adicionar animação de spinning
    const reels = document.querySelectorAll('.reel-item');
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simular delay do spin
    setTimeout(() => {
        const result = generateSpinResult();
        displayResult(result);

        setTimeout(() => {
            checkWin(result);
            updateDisplay();
            gameState.isSpinning = false;

            // Resetar interface
            spinBtn.disabled = false;
            spinBtn.querySelector('.play-text').style.display = 'inline';
            spinBtn.querySelector('.play-loader').style.display = 'none';

            reels.forEach(reel => reel.classList.remove('spinning'));
        }, 1000);
    }, 2000);
}

// Gerar resultado do spin
function generateSpinResult() {
    // Algoritmo que favorece o jogador (como solicitado)
    const winChance = Math.random();

    if (winChance < 0.3) { // 30% chance de vitória
        // Escolher um símbolo vencedor
        const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        return [winningSymbol, winningSymbol, winningSymbol];
    } else {
        // Resultado perdedor
        return [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
    }
}

// Exibir resultado nos rolos
function displayResult(result) {
    const reel1 = document.getElementById('reel1').querySelector('.symbol');
    const reel2 = document.getElementById('reel2').querySelector('.symbol');
    const reel3 = document.getElementById('reel3').querySelector('.symbol');

    reel1.textContent = result[0];
    reel2.textContent = result[1];
    reel3.textContent = result[2];
}

// Verificar vitória
function checkWin(result) {
    const resultString = result.join('');
    const multiplier = multipliers[resultString];

    if (multiplier) {
        const winnings = gameState.currentBet * multiplier;
        gameState.balance += winnings;
        gameState.wins++;
        gameState.streak++;

        showWinAnimation(winnings);
        addToHistory(result, true, winnings);
        createParticles();

        // Linha de vitória
        const winLine = document.getElementById('winLine');
        winLine.classList.add('active');

        // Símbolos vencedores
        const symbols = document.querySelectorAll('.symbol');
        symbols.forEach(symbol => symbol.classList.add('winning'));

        setTimeout(() => {
            winLine.classList.remove('active');
            symbols.forEach(symbol => symbol.classList.remove('winning'));
        }, 3000);

    } else {
        gameState.streak = 0;
        addToHistory(result, false, 0);
    }
}

// Mostrar animação de vitória
function showWinAnimation(amount) {
    winAmount.textContent = `R$ ${amount.toFixed(2)}`;
    winNotification.classList.add('show');
}

// Fechar modal de vitória
function closeWinModal() {
    winNotification.classList.remove('show');
}

// Adicionar ao histórico
function addToHistory(result, isWin, amount) {
    const historyItem = {
        symbols: result.join(''),
        isWin: isWin,
        amount: amount,
        time: new Date()
    };

    gameState.history.unshift(historyItem);

    if (gameState.history.length > 10) {
        gameState.history.pop();
    }

    updateHistoryDisplay();
}

// Atualizar exibição do histórico
function updateHistoryDisplay() {
    historyList.innerHTML = '';

    gameState.history.forEach(item => {
        const historyElement = document.createElement('div');
        historyElement.className = 'recent-item';

        historyElement.innerHTML = `
            <div class="recent-symbols">${item.symbols}</div>
            <div class="recent-result ${item.isWin ? 'win' : 'lose'}">
                ${item.isWin ? `+R$ ${item.amount.toFixed(2)}` : 'Perdeu'}
            </div>
        `;

        historyList.appendChild(historyElement);
    });
}

// Gerar histórico inicial
function generateInitialHistory() {
    for (let i = 0; i < 5; i++) {
        const result = generateSpinResult();
        const isWin = Math.random() < 0.2;
        const amount = isWin ? gameState.currentBet * 5 : 0;

        addToHistory(result, isWin, amount);
    }
}

// Controles de aposta
function increaseBet() {
    if (gameState.currentBet < 50) {
        gameState.currentBet += 1;
        updateDisplay();
        updateQuickBets();
    }
}

function decreaseBet() {
    if (gameState.currentBet > 1) {
        gameState.currentBet -= 1;
        updateDisplay();
        updateQuickBets();
    }
}

function setBet(amount) {
    gameState.currentBet = amount;
    updateDisplay();
    updateQuickBets();
}

// Atualizar botões de aposta rápida
function updateQuickBets() {
    const quickBets = document.querySelectorAll('.quick-bet');
    quickBets.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === gameState.currentBet) {
            btn.classList.add('active');
        }
    });
}

// Atualizar exibição
function updateDisplay() {
    balanceElement.textContent = gameState.balance.toFixed(2);
    currentBetElement.textContent = gameState.currentBet.toFixed(2);
    winsElement.textContent = gameState.wins;
    streakElement.textContent = gameState.streak;
}

// Criar partículas de celebração
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleSymbols = ['🎉', '⭐', '💫', '🎊', '✨'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (3 + Math.random() * 2) + 's';

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 5000);
    }
}

// Event listeners
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !gameState.isSpinning) {
        e.preventDefault();
        spin();
    }
});

// Clique no backdrop do modal para fechar
document.querySelector('.modal-backdrop')?.addEventListener('click', closeWinModal);

document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameBoard = document.getElementById('gameBoard');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const restartBtn = document.getElementById('restartBtn');
    
    // Game state
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matches = 0;
    let timer = 0;
    let timerInterval = null;
    let isPlaying = false;
    let canFlip = true;
    
    // Initialize the game
    initGame();
    
    // Event listeners
    restartBtn.addEventListener('click', initGame);
    
    function initGame() {
        // Reset game state
        gameBoard.innerHTML = '';
        flippedCards = [];
        moves = 0;
        matches = 0;
        timer = 0;
        movesDisplay.textContent = '0';
        timerDisplay.textContent = '0:00';
        stopTimer();
        canFlip = true;
        
        // Create card pairs (8 pairs = 16 cards)
        const cardValues = Array.from({ length: 8 }, (_, i) => i + 1);
        cards = [...cardValues, ...cardValues];
        shuffleCards();
        
        // Create card elements
        cards.forEach((value, index) => {
            const card = createCard(value, index);
            gameBoard.appendChild(card);
        });
        
        isPlaying = true;
        startTimer();
    }
    
    function createCard(value, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = value;
        card.dataset.index = index;
        
        const front = document.createElement('div');
        front.className = 'card-front';
        
        const img = document.createElement('img');
        img.src = `images/${value}.jpg`;
        img.alt = `Card ${value}`;
        front.appendChild(img);
        
        const back = document.createElement('div');
        back.className = 'card-back';
        
        card.appendChild(front);
        card.appendChild(back);
        
        // Add click event to the card
        card.addEventListener('click', () => flipCard(card));
        
        return card;
    }
    
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }
    
    function flipCard(card) {
        // Prevent flipping if conditions are not met
        if (!canFlip || flippedCards.length >= 2 || 
            flippedCards.includes(card) || card.classList.contains('matched')) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // Check for match if two cards are flipped
        if (flippedCards.length === 2) {
            canFlip = false;
            moves++;
            movesDisplay.textContent = moves;
            
            // Wait for flip animation to complete before checking match
            setTimeout(checkMatch, 500);
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.dataset.value === card2.dataset.value;
        
        if (match) {
            handleMatch(card1, card2);
        } else {
            handleMismatch(card1, card2);
        }
    }
    
    function handleMatch(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        matches++;
        flippedCards = [];
        canFlip = true;
        
        if (matches === cards.length / 2) {
            gameComplete();
        }
    }
    
    function handleMismatch(card1, card2) {
        // Add shake animation
        card1.classList.add('shake');
        card2.classList.add('shake');
        
        setTimeout(() => {
            card1.classList.remove('flipped', 'shake');
            card2.classList.remove('flipped', 'shake');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
    
    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    function gameComplete() {
        stopTimer();
        isPlaying = false;
        
        setTimeout(() => {
            alert(`🎉 Congratulations! You completed the game in ${moves} moves and ${timerDisplay.textContent} time!`);
        }, 500);
    }
});
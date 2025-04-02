class MemoryGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.movesDisplay = document.getElementById('moves');
        this.timerDisplay = document.getElementById('timer');
        this.restartBtn = document.getElementById('restartBtn');
        
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matches = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isPlaying = false;
        this.canFlip = true;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        // Clear previous game state
        this.gameBoard.innerHTML = '';
        this.moves = 0;
        this.matches = 0;
        this.flippedCards = [];
        this.movesDisplay.textContent = '0';
        this.timerDisplay.textContent = '0:00';
        this.stopTimer();
        this.canFlip = true;
        
        // Create card pairs (8 pairs = 16 cards)
        const cardValues = Array.from({ length: 8 }, (_, i) => i + 1);
        this.cards = [...cardValues, ...cardValues];
        this.shuffleCards();
        
        // Create card elements
        this.cards.forEach((value, index) => {
            const card = this.createCard(value, index);
            this.gameBoard.appendChild(card);
        });
        
        this.isPlaying = true;
        this.startTimer();
    }

    createCard(value, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = value;
        card.dataset.index = index;
        
        const front = document.createElement('div');
        front.className = 'card-front';
        
        // Create and preload the image
        const img = document.createElement('img');
        img.src = `images/${value}.jpg`;
        img.alt = `Card ${value}`;
        img.onload = () => {
            img.style.opacity = '1';
        };
        front.appendChild(img);
        
        const back = document.createElement('div');
        back.className = 'card-back';
        
        card.appendChild(front);
        card.appendChild(back);
        
        return card;
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    setupEventListeners() {
        this.gameBoard.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (!card || !this.canFlip || this.flippedCards.length >= 2 || 
                this.flippedCards.includes(card) || card.classList.contains('matched')) {
                return;
            }
            this.flipCard(card);
        });

        this.restartBtn.addEventListener('click', () => {
            this.initializeGame();
        });
    }

    flipCard(card) {
        // Prevent flipping more cards while checking for matches
        if (this.flippedCards.length >= 2) return;
        
        // Add flip animation class
        card.classList.add('flipped');
        
        // Add to flipped cards array
        this.flippedCards.push(card);
        
        // Check for match if two cards are flipped
        if (this.flippedCards.length === 2) {
            this.canFlip = false; // Prevent flipping more cards while checking
            this.moves++;
            this.movesDisplay.textContent = this.moves;
            
            // Wait for flip animation to complete before checking match
            setTimeout(() => {
                this.checkMatch();
            }, 300);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.value === card2.dataset.value;

        if (match) {
            this.handleMatch(card1, card2);
        } else {
            this.handleMismatch(card1, card2);
        }
    }

    handleMatch(card1, card2) {
        // Add matched class with animation
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        this.matches++;
        this.flippedCards = [];
        this.canFlip = true; // Allow flipping again

        if (this.matches === this.cards.length / 2) {
            this.gameComplete();
        }
    }

    handleMismatch(card1, card2) {
        // Add shake animation
        card1.classList.add('shake');
        card2.classList.add('shake');
        
        setTimeout(() => {
            card1.classList.remove('flipped', 'shake');
            card2.classList.remove('flipped', 'shake');
            this.flippedCards = [];
            this.canFlip = true; // Allow flipping again
        }, 1000);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60);
            const seconds = this.timer % 60;
            this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    gameComplete() {
        this.stopTimer();
        this.isPlaying = false;
        
        setTimeout(() => {
            alert(`🎉 Congratulations! You completed the game in ${this.moves} moves and ${this.timerDisplay.textContent} time!`);
        }, 500);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
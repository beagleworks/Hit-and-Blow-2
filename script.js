import {
    SECRET_LENGTH,
    generateSecretNumber,
    evaluateGuess,
    generateFlavorText,
} from './gameLogic.js';

let secretNumber = '';
let attempts = 0;
let finished = false;

const attemptCountEl = document.getElementById('attempt-count');
const latestResultEl = document.getElementById('latest-result');
const historyListEl = document.getElementById('history-list');
const feedbackEl = document.getElementById('feedback');
const guessInputEl = document.getElementById('guess-input');
const guessForm = document.getElementById('guess-form');
const restartButton = document.getElementById('restart');

function startNewGame() {
    secretNumber = generateSecretNumber();
    attempts = 0;
    finished = false;
    attemptCountEl.textContent = attempts.toString();
    latestResultEl.textContent = '-';
    historyListEl.innerHTML = '';
    feedbackEl.textContent = '幸運を祈ります！';
    feedbackEl.className = 'feedback';
    guessInputEl.value = '';
    guessInputEl.disabled = false;
    guessInputEl.focus();
    restartButton.textContent = '新しいゲーム';
}

function handleGuessSubmit(event) {
    event.preventDefault();
    if (finished) {
        feedbackEl.textContent = '新しいゲームを開始してください。';
        feedbackEl.className = 'feedback error';
        return;
    }

    const guess = guessInputEl.value.trim();
    if (!/^\d{4}$/.test(guess)) {
        feedbackEl.textContent = '4桁の数字を入力してください。';
        feedbackEl.className = 'feedback error';
        return;
    }

    attempts += 1;
    attemptCountEl.textContent = attempts.toString();

    const { hits, blows } = evaluateGuess(guess, secretNumber);
    latestResultEl.textContent = `${hits} Hit / ${blows} Blow`;

    addHistoryItem(guess, hits, blows);

    if (hits === SECRET_LENGTH) {
        finished = true;
        feedbackEl.textContent = `お見事！ ${attempts} 回で正解を導きました。`;
        feedbackEl.className = 'feedback success';
        guessInputEl.disabled = true;
        restartButton.textContent = 'もう一度遊ぶ';
    } else {
        const flavor = generateFlavorText(hits, blows);
        feedbackEl.textContent = flavor;
        feedbackEl.className = 'feedback';
        guessInputEl.value = '';
        guessInputEl.focus();
    }
}

function addHistoryItem(guess, hits, blows) {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `<strong>${guess}</strong><span>${hits} Hit / ${blows} Blow</span>`;
    historyListEl.prepend(li);
}

document.addEventListener('DOMContentLoaded', () => {
    startNewGame();
    guessForm.addEventListener('submit', handleGuessSubmit);
    restartButton.addEventListener('click', startNewGame);
});

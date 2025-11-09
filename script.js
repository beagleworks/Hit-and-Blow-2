import {
    SECRET_LENGTH,
    generateSecretNumber,
    evaluateGuess,
    generateFlavorText,
    getAvailableSymbols,
    SYMBOL_POOL,
} from './gameLogic.js';

let secretNumber = '';
let attempts = 0;
let finished = false;
let gameOptions = {
    allowDuplicates: false,
    symbolCount: 10,
};

const attemptCountEl = document.getElementById('attempt-count');
const latestResultEl = document.getElementById('latest-result');
const historyListEl = document.getElementById('history-list');
const feedbackEl = document.getElementById('feedback');
const guessInputEl = document.getElementById('guess-input');
const guessForm = document.getElementById('guess-form');
const restartButton = document.getElementById('restart');
const instructionEl = document.querySelector('.instruction');
const optionsForm = document.getElementById('options-form');
const symbolCountSelect = document.getElementById('symbol-count');

function formatSymbolList(symbols) {
    if (symbols.length <= 10) {
        return `${symbols[0]}〜${symbols[symbols.length - 1]}`;
    }
    const digitsPart = symbols.slice(0, 10).join('');
    const lettersPart = symbols.slice(10).join(', ');
    return `${digitsPart} と ${lettersPart}`;
}

function updateInstruction() {
    const symbols = getAvailableSymbols(gameOptions.symbolCount);
    const symbolDescription = formatSymbolList(symbols);
    const duplicateMessage = gameOptions.allowDuplicates ? '同じ文字の使用可' : '同じ文字の使用不可';
    instructionEl.textContent = `${SECRET_LENGTH}桁の文字列を入力してください（使用可能: ${symbolDescription}／${duplicateMessage}）`;
    guessInputEl.placeholder = symbols.slice(0, SECRET_LENGTH).join('');
}

function sanitizeInput(value) {
    const availableSymbols = getAvailableSymbols(gameOptions.symbolCount);
    const upperValue = value.toUpperCase();
    const filtered = upperValue
        .split('')
        .filter((char) => SYMBOL_POOL.includes(char))
        .filter((char) => availableSymbols.includes(char));

    if (!gameOptions.allowDuplicates) {
        const seen = new Set();
        return filtered.filter((char) => {
            if (seen.has(char)) {
                return false;
            }
            seen.add(char);
            return true;
        }).slice(0, SECRET_LENGTH).join('');
    }

    return filtered.slice(0, SECRET_LENGTH).join('');
}

function readOptionsFromForm() {
    const duplicateRadio = optionsForm.querySelector('input[name="duplicates"]:checked');
    const allowDuplicates = duplicateRadio ? duplicateRadio.value === 'allow' : gameOptions.allowDuplicates;
    const symbolCount = Number(symbolCountSelect.value);
    return { allowDuplicates, symbolCount };
}

function applyOptions() {
    gameOptions = readOptionsFromForm();
    startNewGame();
}

function startNewGame() {
    secretNumber = generateSecretNumber(gameOptions);
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
    updateInstruction();
}

function handleGuessSubmit(event) {
    event.preventDefault();
    if (finished) {
        feedbackEl.textContent = '新しいゲームを開始してください。';
        feedbackEl.className = 'feedback error';
        return;
    }

    const guess = sanitizeInput(guessInputEl.value.trim());
    guessInputEl.value = guess;

    if (guess.length !== SECRET_LENGTH) {
        feedbackEl.textContent = `${SECRET_LENGTH}桁の文字列を入力してください。`;
        feedbackEl.className = 'feedback error';
        return;
    }

    const availableSymbols = getAvailableSymbols(gameOptions.symbolCount);
    const hasInvalidChar = guess.split('').some((char) => !availableSymbols.includes(char));
    if (hasInvalidChar) {
        feedbackEl.textContent = '利用できない文字が含まれています。';
        feedbackEl.className = 'feedback error';
        return;
    }

    if (!gameOptions.allowDuplicates) {
        const uniqueCount = new Set(guess.split('')).size;
        if (uniqueCount !== SECRET_LENGTH) {
            feedbackEl.textContent = '同じ文字は使用できません。';
            feedbackEl.className = 'feedback error';
            return;
        }
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
    guessInputEl.addEventListener('input', () => {
        guessInputEl.value = sanitizeInput(guessInputEl.value);
    });
    optionsForm.addEventListener('change', applyOptions);
    optionsForm.addEventListener('submit', (event) => {
        event.preventDefault();
    });
});

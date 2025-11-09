export const SECRET_LENGTH = 4;
export const SYMBOL_POOL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

export function getAvailableSymbols(count) {
    if (!Number.isInteger(count)) {
        throw new Error('Symbol count must be an integer.');
    }
    if (count < 1 || count > SYMBOL_POOL.length) {
        throw new Error(`Symbol count must be between 1 and ${SYMBOL_POOL.length}.`);
    }
    return SYMBOL_POOL.slice(0, count);
}

export function generateSecretNumber(options = {}) {
    const {
        allowDuplicates = false,
        symbolCount = 10,
    } = options;

    const availableSymbols = getAvailableSymbols(symbolCount);

    if (!allowDuplicates && availableSymbols.length < SECRET_LENGTH) {
        throw new Error('Cannot generate a unique secret with the requested symbol count.');
    }

    if (allowDuplicates) {
        return Array.from({ length: SECRET_LENGTH }, () => {
            const index = Math.floor(Math.random() * availableSymbols.length);
            return availableSymbols[index];
        }).join('');
    }

    const pool = [...availableSymbols];
    for (let i = pool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, SECRET_LENGTH).join('');
}

export function evaluateGuess(guess, secret) {
    if (guess.length !== SECRET_LENGTH || secret.length !== SECRET_LENGTH) {
        throw new Error('Guess and secret must be 4 characters long.');
    }

    const normalizedGuess = guess.toUpperCase();
    const normalizedSecret = secret.toUpperCase();

    let hits = 0;
    let blows = 0;

    const secretCounts = {};
    const guessCounts = {};

    for (let i = 0; i < SECRET_LENGTH; i += 1) {
        if (normalizedGuess[i] === normalizedSecret[i]) {
            hits += 1;
        }
        const secretChar = normalizedSecret[i];
        const guessChar = normalizedGuess[i];
        secretCounts[secretChar] = (secretCounts[secretChar] || 0) + 1;
        guessCounts[guessChar] = (guessCounts[guessChar] || 0) + 1;
    }

    Object.keys(guessCounts).forEach((digit) => {
        blows += Math.min(guessCounts[digit], secretCounts[digit] || 0);
    });

    blows -= hits;

    return { hits, blows };
}

export function generateFlavorText(hits, blows) {
    if (hits === 0 && blows === 0) {
        return '数字は全く含まれていないようです…新たな一手を！';
    }
    if (hits >= 3) {
        return '勝利は目前！この調子で攻めましょう。';
    }
    if (hits >= 1) {
        return '正しい位置を押さえています。さらに詰めていきましょう！';
    }
    if (blows >= 3) {
        return '数字は揃ってきた！あとは並べ替えです。';
    }
    if (blows >= 1) {
        return '数字は合ってきています。位置を見直しましょう。';
    }
    return '惜しい！視点を変えて攻めてみましょう。';
}

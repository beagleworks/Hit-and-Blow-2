export const SECRET_LENGTH = 4;

export function generateSecretNumber() {
    return Array.from({ length: SECRET_LENGTH }, () => Math.floor(Math.random() * 10)).join('');
}

export function evaluateGuess(guess, secret) {
    if (guess.length !== SECRET_LENGTH || secret.length !== SECRET_LENGTH) {
        throw new Error('Guess and secret must be 4 characters long.');
    }

    let hits = 0;
    let blows = 0;

    const secretCounts = {};
    const guessCounts = {};

    for (let i = 0; i < SECRET_LENGTH; i += 1) {
        if (guess[i] === secret[i]) {
            hits += 1;
        }
        secretCounts[secret[i]] = (secretCounts[secret[i]] || 0) + 1;
        guessCounts[guess[i]] = (guessCounts[guess[i]] || 0) + 1;
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

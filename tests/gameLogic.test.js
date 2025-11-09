import test from 'node:test';
import assert from 'node:assert/strict';
import {
    SECRET_LENGTH,
    evaluateGuess,
    generateFlavorText,
    generateSecretNumber,
    getAvailableSymbols,
} from '../gameLogic.js';

test('generateSecretNumber creates unique numeric strings by default', () => {
    for (let i = 0; i < 20; i += 1) {
        const secret = generateSecretNumber();
        assert.strictEqual(secret.length, SECRET_LENGTH);
        assert.match(secret, /^\d+$/);
        assert.strictEqual(new Set(secret.split('')).size, SECRET_LENGTH);
    }
});

test('generateSecretNumber supports custom symbol counts and duplicate rules', () => {
    const secret = generateSecretNumber({ allowDuplicates: false, symbolCount: 6 });
    assert.strictEqual(secret.length, SECRET_LENGTH);
    assert.match(secret, /^[0-5]{4}$/);
    assert.strictEqual(new Set(secret.split('')).size, SECRET_LENGTH);

    const duplicateSecret = generateSecretNumber({ allowDuplicates: true, symbolCount: 1 });
    assert.strictEqual(duplicateSecret, '0000');

    assert.throws(() => generateSecretNumber({ allowDuplicates: false, symbolCount: 3 }));
});

test('evaluateGuess counts hits correctly', () => {
    const { hits, blows } = evaluateGuess('1234', '1289');
    assert.strictEqual(hits, 2);
    assert.strictEqual(blows, 0);
});

test('evaluateGuess counts blows correctly', () => {
    const { hits, blows } = evaluateGuess('1234', '4123');
    assert.strictEqual(hits, 0);
    assert.strictEqual(blows, 4);
});

test('evaluateGuess handles duplicate digits properly', () => {
    const { hits, blows } = evaluateGuess('1122', '2211');
    assert.strictEqual(hits, 0);
    assert.strictEqual(blows, 4);
});

test('evaluateGuess works with alphabetic symbols', () => {
    const { hits, blows } = evaluateGuess('ABCD', 'A1CD');
    assert.strictEqual(hits, 3);
    assert.strictEqual(blows, 0);
});

test('evaluateGuess rejects invalid lengths', () => {
    assert.throws(() => evaluateGuess('123', '5678'));
    assert.throws(() => evaluateGuess('12345', '5678'));
});

test('generateFlavorText responds to results', () => {
    assert.match(generateFlavorText(0, 0), /数字は全く含まれていないようです/);
    assert.match(generateFlavorText(3, 0), /勝利は目前/);
});

test('getAvailableSymbols returns the requested range', () => {
    assert.deepStrictEqual(getAvailableSymbols(6), ['0', '1', '2', '3', '4', '5']);
    assert.deepStrictEqual(getAvailableSymbols(16)[15], 'F');
    assert.throws(() => getAvailableSymbols(0));
});

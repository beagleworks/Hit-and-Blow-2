import test from 'node:test';
import assert from 'node:assert/strict';
import { SECRET_LENGTH, evaluateGuess, generateFlavorText, generateSecretNumber } from '../gameLogic.js';

test('generateSecretNumber creates numeric strings of expected length', () => {
    for (let i = 0; i < 20; i += 1) {
        const secret = generateSecretNumber();
        assert.strictEqual(secret.length, SECRET_LENGTH);
        assert.match(secret, /^\d+$/);
    }
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

test('evaluateGuess rejects invalid lengths', () => {
    assert.throws(() => evaluateGuess('123', '5678'));
    assert.throws(() => evaluateGuess('12345', '5678'));
});

test('generateFlavorText responds to results', () => {
    assert.match(generateFlavorText(0, 0), /数字は全く含まれていないようです/);
    assert.match(generateFlavorText(3, 0), /勝利は目前/);
});

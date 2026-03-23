import { Alert, Platform, Share } from 'react-native';

// Spoiler-free share text generators for each daily game.
// Never include specific player names, answers, or details that reveal the daily content.

export function sharePowerPlay(league: string, score: number, _target: number, questionsHit: number, totalQuestions: number) {
  const text = [
    `Ball Knowledge — Power Play`,
    `${league} | ${score} pts | ${questionsHit}/${totalQuestions} questions hit`,
    `ballknowledge.app`,
  ].join('\n');
  return copyAndNotify(text);
}

export function shareAutoComplete(league: string, score: number, target: number, promptsHit: number, totalPrompts: number) {
  const pct = Math.round((score / target) * 100);
  const bar = buildBar(pct);
  const text = [
    `Ball Knowledge — Auto Complete`,
    `${league} | ${score}/${target} pts | ${promptsHit}/${totalPrompts} prompts cleared`,
    bar,
    `ballknowledge.app`,
  ].join('\n');
  return copyAndNotify(text);
}

export function shareGuesser(league: string, solved: boolean, guessCount: number, maxGuesses: number) {
  const squares = Array.from({ length: maxGuesses }, (_, i) => {
    if (i < guessCount - 1) return '\u2B1B'; // black square for wrong guesses
    if (i === guessCount - 1 && solved) return '\uD83D\uDFE9'; // green square for solve
    if (i === guessCount - 1 && !solved) return '\uD83D\uDFE5'; // red square for final fail
    return '\u2B1C'; // white square for unused
  }).join('');

  const text = [
    `Ball Knowledge — Mystery Player`,
    `${league} | ${solved ? `Solved in ${guessCount}/${maxGuesses}` : `X/${maxGuesses}`}`,
    squares,
    `ballknowledge.app`,
  ].join('\n');
  return copyAndNotify(text);
}

export function shareShowdown(league: string, pickedCorrect: boolean, votePct: number) {
  const text = [
    `Ball Knowledge — Showdown`,
    `${league} | ${pickedCorrect ? 'Correct pick' : 'Wrong pick'} | ${votePct}% agreed`,
    pickedCorrect ? '\uD83D\uDFE9' : '\uD83D\uDFE5',
    `ballknowledge.app`,
  ].join('\n');
  return copyAndNotify(text);
}

export function shareTrivia(league: string, score: number, total: number, timeSec: number) {
  const emoji = Array.from({ length: total }, (_, i) =>
    i < score ? '\uD83D\uDFE9' : '\uD83D\uDFE5'
  ).join('');
  const text = [
    `Ball Knowledge — Trivia`,
    `${league} | ${score}/${total} correct | ${timeSec}s`,
    emoji,
    `ballknowledge.app`,
  ].join('\n');
  return copyAndNotify(text);
}

export function shareRank5(league: string, matchCount: number, total: number) {
  const text = [
    `Ball Knowledge — Rank 5`,
    `${league} | ${matchCount}/${total} matched the crowd`,
    buildBar(Math.round((matchCount / total) * 100)),
    `ballknowledge.app`,
  ].join('\n');
  return copyAndNotify(text);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildBar(pct: number): string {
  const filled = Math.round(pct / 10);
  return '\uD83D\uDFE9'.repeat(filled) + '\u2B1C'.repeat(10 - filled) + ` ${pct}%`;
}

async function copyAndNotify(text: string) {
  try {
    await Share.share({ message: text });
  } catch {
    // Fallback: just alert — Share.share handles clipboard on most platforms
    Alert.alert('Share', text);
  }
}

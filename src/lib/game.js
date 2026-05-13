export const CORRECT_ANSWER = 'marcus webb'

export function checkAnswer(input) {
  return input.toLowerCase().includes(CORRECT_ANSWER)
}

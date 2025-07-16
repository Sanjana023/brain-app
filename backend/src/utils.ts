export function random(len: number) {
  let options = 'qwertgbcjfbk2387687945676';
  let ans = '';
  for (let i = 0; i < len; i++) {
    ans += options[Math.floor(Math.random() * options.length)];
  }
  return ans;
}

export const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  CSS: '#563d7c',
  HTML: '#e34c26',
  React: '#61dafb',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  Shell: '#89e051',
  Vue: '#41b883',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
}

export function getLangColor(lang) {
  if (!lang) return '#484f58'
  return LANG_COLORS[lang] || '#484f58'
}
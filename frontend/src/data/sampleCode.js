export const SAMPLE_CODE = `function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("CodeLab"));`;

export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', extension: 'js' },
  { id: 'typescript', label: 'TypeScript', extension: 'ts' },
  { id: 'java', label: 'Java', extension: 'java' },
  { id: 'python', label: 'Python', extension: 'py' },
  { id: 'c', label: 'C', extension: 'c' },
  { id: 'cpp', label: 'C++', extension: 'cpp' },
  { id: 'html', label: 'HTML', extension: 'html' },
  { id: 'css', label: 'CSS', extension: 'css' },
  { id: 'json', label: 'JSON', extension: 'json' },
  { id: 'sql', label: 'SQL', extension: 'sql' }
];

export function extensionFor(languageId) {
  const found = LANGUAGES.find((l) => l.id === languageId);
  return found ? found.extension : 'txt';
}

export function languageLabel(languageId) {
  const found = LANGUAGES.find((l) => l.id === languageId);
  return found ? found.label : languageId;
}

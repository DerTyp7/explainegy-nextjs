
export function isValidText(text: string): boolean {
  const textRegex = /^[a-zA-Z\s\d\-_\(\)\[\]\{\}\!\@\#\$\%\^\&\*\+\=\,\.\?\/\\\|\'\":;]+$/;
  return textRegex.test(text) && text.length > 0;
}

export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9\-_]+$/;
  return nameRegex.test(name);
}
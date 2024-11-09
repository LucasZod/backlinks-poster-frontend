export const isValidName = (name: string): boolean => {
  const words = name.trim().split(/\s+/)
  return words.length > 1 && words.every((word) => /^[A-Za-zÀ-ÿ]+$/.test(word))
}

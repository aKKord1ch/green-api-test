/** Оставляет только цифры; российский номер с 8 в начале приводит к 7. */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('8')) return `7${digits.slice(1)}`
  return digits
}

export function isValidPhone(phone: string): boolean {
  return /^\d{10,15}$/.test(phone)
}

export function phoneToChatId(phone: string): string {
  return `${phone}@c.us`
}

/** 79991234567 → +7 999 123-45-67 (для прочих длин — просто +цифры). */
export function formatPhone(phone: string): string {
  const match = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone)
  if (match) return `+7 ${match[1]} ${match[2]}-${match[3]}-${match[4]}`
  return /^\d+$/.test(phone) ? `+${phone}` : phone
}

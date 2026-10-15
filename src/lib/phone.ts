import { DEFAULT_COUNTRY_CODE } from '../config'

/** Deixa só os dígitos e adiciona o código do país quando vier só DDD + número. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^0+/, '')
  if (digits.length === 10 || digits.length === 11) return DEFAULT_COUNTRY_CODE + digits
  return digits
}

export function isValidPhone(phone: string): boolean {
  return phone.length >= 12 && phone.length <= 15
}

/** 5511999998888 -> +55 (11) 99999-8888. Outros formatos só ganham o "+". */
export function formatPhone(phone: string): string {
  const br = phone.match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  if (br) return `+55 (${br[1]}) ${br[2]}-${br[3]}`
  return phone ? `+${phone}` : ''
}

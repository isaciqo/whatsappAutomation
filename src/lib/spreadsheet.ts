import { MAX_CONTACTS } from '../config'
import type { Contact } from '../types'
import { isValidPhone, normalizePhone } from './phone'

type Field = 'name' | 'phone' | 'message'

/** Nomes de coluna aceitos (comparados sem acento e em minúsculas). */
const HEADER_ALIASES: Record<Field, string[]> = {
  name: ['nome', 'name', 'cliente'],
  phone: ['telefone', 'celular', 'numero', 'whatsapp', 'phone', 'fone'],
  message: ['mensagem', 'message', 'texto', 'msg'],
}

export interface ParseResult {
  contacts: Contact[]
  /** Linhas com dados que ficaram de fora por causa do limite. */
  truncated: number
}

function normalizeHeader(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()
}

function cellToString(value: unknown): string {
  // Telefones salvos como número no Excel não podem virar notação científica.
  if (typeof value === 'number') return Number.isInteger(value) ? value.toFixed(0) : String(value)
  return String(value ?? '').trim()
}

// A lib de Excel é pesada: só é baixada quando o usuário realmente usa.
const loadXlsx = () => import('xlsx')

export async function parseSpreadsheet(file: File): Promise<ParseResult> {
  const { read, utils } = await loadXlsx()
  const workbook = read(await file.arrayBuffer())
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!sheet) throw new Error('A planilha está vazia.')

  const rows = utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: '' })
  const headerIndex = rows.findIndex((r) => r.some((c) => cellToString(c) !== ''))
  if (headerIndex === -1) throw new Error('A planilha está vazia.')

  const headers = rows[headerIndex].map(normalizeHeader)
  const columns = {} as Record<Field, number>
  for (const field of Object.keys(HEADER_ALIASES) as Field[]) {
    columns[field] = headers.findIndex((h) => HEADER_ALIASES[field].includes(h))
  }
  if (columns.phone === -1 || columns.message === -1) {
    throw new Error('Não encontrei as colunas "Telefone" e "Mensagem". Use o modelo como base.')
  }

  const contacts: Contact[] = []
  let truncated = 0

  rows.slice(headerIndex + 1).forEach((r, i) => {
    const get = (field: Field) => (columns[field] === -1 ? '' : cellToString(r[columns[field]]))
    const rawPhone = get('phone')
    const message = get('message')
    if (!rawPhone && !message) return

    if (contacts.length >= MAX_CONTACTS) {
      truncated++
      return
    }

    const phone = normalizePhone(rawPhone)
    contacts.push({
      id: contacts.length,
      row: headerIndex + i + 2,
      name: get('name'),
      phone,
      message,
      valid: isValidPhone(phone) && message !== '',
    })
  })

  if (contacts.length === 0) throw new Error('Nenhum contato encontrado abaixo do cabeçalho.')
  return { contacts, truncated }
}

export async function downloadTemplate() {
  const { utils, writeFile } = await loadXlsx()
  const sheet = utils.aoa_to_sheet([
    ['Nome', 'Telefone', 'Mensagem'],
    ['Maria Silva', '11999998888', 'Olá Maria! Seu pedido já está pronto para retirada.'],
    ['João Souza', '(21) 98888-7777', 'Oi João, tudo bem? Passando para lembrar do seu horário amanhã às 14h.'],
  ])
  sheet['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 70 }]
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, sheet, 'Contatos')
  writeFile(workbook, 'modelo-contatos.xlsx')
}

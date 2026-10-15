export interface Contact {
  id: number
  /** Linha original na planilha (para o usuário achar o erro). */
  row: number
  name: string
  /** Número só com dígitos, já com código do país. */
  phone: string
  message: string
  valid: boolean
}

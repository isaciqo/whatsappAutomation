import { useState } from 'react'
import { PREVIEW_LENGTH } from '../config'
import { formatPhone } from '../lib/phone'
import { whatsappLink } from '../lib/whatsapp'
import type { Contact } from '../types'

interface Props {
  contact: Contact
  sent: boolean
  onSend: (id: number) => void
}

export function ContactRow({ contact, sent, onSend }: Props) {
  const [expanded, setExpanded] = useState(false)
  const isLong = contact.message.length > PREVIEW_LENGTH
  const text = expanded || !isLong ? contact.message : contact.message.slice(0, PREVIEW_LENGTH).trimEnd() + '…'

  return (
    <tr className={sent ? 'is-sent' : undefined}>
      <td data-label="Telefone" className="cell-phone">
        {contact.valid ? (
          formatPhone(contact.phone)
        ) : (
          <span className="invalid" title={`Verifique a linha ${contact.row} da planilha`}>
            {contact.phone ? formatPhone(contact.phone) : 'Sem número'}
          </span>
        )}
      </td>
      <td data-label="Nome" className="cell-name">
        {contact.name || <span className="muted">—</span>}
      </td>
      <td data-label="Mensagem" className="cell-message">
        <p className={expanded ? 'message is-expanded' : 'message'}>{text || <span className="muted">Sem mensagem</span>}</p>
        {isLong && (
          <button type="button" className="link-btn" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'ver menos' : 'ver mensagem completa'}
          </button>
        )}
      </td>
      <td className="cell-action">
        {contact.valid ? (
          <a
            className={sent ? 'btn btn-sent' : 'btn btn-primary'}
            href={whatsappLink(contact.phone, contact.message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSend(contact.id)}
          >
            {sent ? 'Enviado ✓' : 'Enviar'}
          </a>
        ) : (
          <span className="btn btn-disabled" title={`Linha ${contact.row}: telefone ou mensagem inválidos`}>
            Inválido
          </span>
        )}
      </td>
    </tr>
  )
}

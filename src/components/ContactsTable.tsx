import type { Contact } from '../types'
import { ContactRow } from './ContactRow'

interface Props {
  contacts: Contact[]
  sentIds: Set<number>
  onSend: (id: number) => void
}

export function ContactsTable({ contacts, sentIds, onSend }: Props) {
  return (
    <div className="table-wrap">
      <table className="contacts">
        <thead>
          <tr>
            <th>Telefone</th>
            <th>Nome</th>
            <th>Mensagem</th>
            <th aria-label="Ação" />
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <ContactRow key={c.id} contact={c} sent={sentIds.has(c.id)} onSend={onSend} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

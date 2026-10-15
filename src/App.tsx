import { useState } from 'react'
import { ContactsTable } from './components/ContactsTable'
import { UploadArea } from './components/UploadArea'
import { MAX_CONTACTS } from './config'
import { parseSpreadsheet } from './lib/spreadsheet'
import type { Contact } from './types'

interface Loaded {
  fileName: string
  contacts: Contact[]
  truncated: number
}

export function App() {
  const [data, setData] = useState<Loaded | null>(null)
  const [sentIds, setSentIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)
    try {
      const { contacts, truncated } = await parseSpreadsheet(file)
      setData({ fileName: file.name, contacts, truncated })
      setSentIds(new Set())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível ler o arquivo.')
    } finally {
      setLoading(false)
    }
  }

  function markSent(id: number) {
    setSentIds((prev) => new Set(prev).add(id))
  }

  const validCount = data?.contacts.filter((c) => c.valid).length ?? 0
  const invalidCount = (data?.contacts.length ?? 0) - validCount

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <h1>Disparo WhatsApp</h1>
        </div>
        <p className="subtitle">Suba a planilha, revise as mensagens e envie uma a uma.</p>
      </header>

      <main>
        {!data ? (
          <UploadArea onFile={handleFile} loading={loading} error={error} />
        ) : (
          <>
            <div className="toolbar">
              <div className="file-info">
                <span className="file-name">{data.fileName}</span>
                <span className="stats">
                  {data.contacts.length} contatos · <strong>{sentIds.size}</strong> de {validCount} enviados
                  {invalidCount > 0 && <span className="stats-invalid"> · {invalidCount} inválidos</span>}
                </span>
              </div>
              <button type="button" className="btn btn-ghost" onClick={() => setData(null)}>
                Trocar planilha
              </button>
            </div>

            <div className="progress" aria-hidden="true">
              <div className="progress-bar" style={{ width: `${validCount ? (sentIds.size / validCount) * 100 : 0}%` }} />
            </div>

            {data.truncated > 0 && (
              <p className="alert alert-warning">
                A planilha tem mais de {MAX_CONTACTS} contatos. Carreguei os primeiros {MAX_CONTACTS} e{' '}
                {data.truncated} ficaram de fora.
              </p>
            )}

            <ContactsTable contacts={data.contacts} sentIds={sentIds} onSend={markSent} />
          </>
        )}
      </main>

      <footer className="footer">Os dados da planilha ficam só no seu navegador. Nada é enviado para servidor.</footer>
    </div>
  )
}

import { useRef, useState, type DragEvent } from 'react'
import { MAX_CONTACTS } from '../config'
import { downloadTemplate } from '../lib/spreadsheet'

interface Props {
  onFile: (file: File) => void
  loading: boolean
  error: string | null
}

export function UploadArea({ onFile, loading, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <section className="upload">
      <div
        className={`dropzone${dragging ? ' is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      >
        <svg className="dropzone-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M12 18v-6M9 15l3-3 3 3" />
        </svg>
        <p className="dropzone-title">{loading ? 'Lendo planilha…' : 'Arraste sua planilha aqui'}</p>
        <p className="dropzone-hint">ou clique para escolher · .xlsx, .xls ou .csv · até {MAX_CONTACTS} contatos</p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFile(file)
            e.target.value = ''
          }}
        />
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      <div className="format-help">
        <p>
          A planilha precisa das colunas <code>Nome</code>, <code>Telefone</code> e <code>Mensagem</code> na primeira
          linha.
        </p>
        <button type="button" className="btn btn-ghost" onClick={downloadTemplate}>
          Baixar modelo
        </button>
      </div>
    </section>
  )
}

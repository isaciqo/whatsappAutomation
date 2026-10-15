# Disparo WhatsApp

Página estática que lê uma planilha (`.xlsx`, `.xls` ou `.csv`), lista os contatos e gera um botão por contato que abre o WhatsApp com o número e a mensagem preenchidos (link `wa.me`). Sem back-end e sem banco de dados: o arquivo é lido no navegador.

## Formato da planilha

Primeira linha com os cabeçalhos (a ordem não importa, maiúsculas e acentos são ignorados):

| Nome        | Telefone        | Mensagem              |
| ----------- | --------------- | --------------------- |
| Maria Silva | 11999998888     | Olá Maria! ...        |
| João Souza  | (21) 98888-7777 | Oi João, tudo bem? .. |

- Também são aceitos `Celular`, `Número`, `WhatsApp` para telefone e `Texto` para mensagem.
- Números com 10 ou 11 dígitos (DDD + número) recebem o `55` automaticamente.
- Limite de 100 contatos por planilha (`src/config.ts`).

A página tem um botão **Baixar modelo** que gera a planilha de exemplo.

## Rodando local

```bash
npm install
npm run dev
```

## Deploy na Vercel

Importe o repositório na Vercel. Ela detecta o Vite sozinha (build `npm run build`, saída `dist`). Não precisa de variável de ambiente.

# Esfiha Prime — Backend

API REST do Esfiha Prime, desenvolvida com Express, Prisma e PostgreSQL hospedado no [Neon DB](https://neon.com).

**API em produção:** [https://neon-db.vercel.app](https://neon-db.vercel.app)

## Tecnologias

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Neon)
- Vercel

## Estrutura

```text
api/
├── prisma/
│   ├── migrations/       # Histórico das alterações do banco
│   ├── schema.prisma     # Modelos Prisma
│   └── seed.js           # Dados iniciais de desenvolvimento
├── src/
│   ├── controllers/
│   ├── data/
│   ├── enums/
│   └── routes/
├── index.js              # Configuração do Express e rotas
└── server.js             # Inicialização local do servidor
```

## Modelos

### Categoria

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | inteiro | Gerado automaticamente |
| `nome` | texto | Único |

### Esfiha

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | inteiro | Gerado automaticamente |
| `nome` | texto | Obrigatório |
| `preco` | número | Obrigatório |
| `disponivel` | enum | `DISPONIVEL` ou `INDISPONIVEL` |
| `categoriaId` | inteiro | ID de uma categoria existente |

## Configuração local

### 1. Instale as dependências

No terminal, na raiz do projeto:

```bat
cd api
npm install
```

### 2. Configure o Neon

Crie o arquivo `api/.env` e adicione a URL de conexão fornecida pelo Neon:

```env
PORT=3000
DATABASE_URL="postgresql://USUARIO:SENHA@HOST/neondb?sslmode=require"
```

Não envie o arquivo `.env` para o GitHub.

### 3. Crie as tabelas no banco

Com uma migration já versionada no projeto, aplique-a no Neon:

```bat
npx prisma generate
npx prisma migrate deploy
```

Para criar uma migration após modificar o `schema.prisma`, use:

```bat
npx prisma migrate dev --name nome_da_alteracao
```

Depois, envie a nova pasta criada em `api/prisma/migrations/` para o GitHub.

### 4. Dados de desenvolvimento (opcional)

```bat
npx prisma db seed
```

> Atenção: o seed remove todas as esfihas e categorias antes de cadastrar os exemplos. Use-o somente em banco de desenvolvimento.

### 5. Inicie a API

```bat
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

## API em produção

A API publicada na Vercel está disponível em:

```text
https://neon-db.vercel.app
```

Exemplos:

```text
https://neon-db.vercel.app/
https://neon-db.vercel.app/esfihas/listar
https://neon-db.vercel.app/categorias/listar
```

## Rotas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Status e lista de rotas |
| GET | `/categorias/listar` | Lista categorias e suas esfihas |
| POST | `/categorias/cadastrar` | Cadastra uma categoria |
| PUT | `/categorias/atualizar/:id` | Atualiza uma categoria |
| DELETE | `/categorias/excluir/:id` | Exclui uma categoria sem esfihas vinculadas |
| GET | `/esfihas/listar` | Lista esfihas e suas categorias |
| POST | `/esfihas/cadastrar` | Cadastra uma esfiha |
| PUT | `/esfihas/atualizar/:id` | Atualiza uma esfiha |
| DELETE | `/esfihas/excluir/:id` | Exclui uma esfiha |
| GET | `/enums/disponibilidade` | Lista valores de disponibilidade expostos pela API |

### Exemplos de payload

Criar categoria:

```json
{
  "nome": "Tradicionais"
}
```

Criar esfiha:

```json
{
  "nome": "Carne",
  "preco": 8.5,
  "disponivel": "DISPONIVEL",
  "categoriaId": 1
}
```

O cadastro e a atualização de categorias retornam `409` quando o nome já existe, inclusive com diferenças de maiúsculas, acentos ou espaços extras.

## Insomnia

Importe a coleção [Insomnia_2026-11-23-09-09-21.yaml](./docs/Insomnia_2026-11-23-09-09-21.yaml) no Insomnia. Ajuste as variáveis `categoria_id` e `esfiha_id` conforme os IDs do seu banco.

## Deploy na Vercel

1. Envie o projeto, incluindo `api/prisma/migrations/`, para o GitHub.
2. Na Vercel, importe o repositório e configure **Root Directory** como `api`.
3. No terminal, dentro de `api`, vincule e publique o projeto:

```bat
npx vercel login
npx vercel link
npx vercel env add DATABASE_URL --environment production
npx vercel env add DATABASE_URL --environment preview
npx vercel --prod
```

Ao executar os comandos `vercel env add`, cole somente a URL do Neon quando o terminal solicitar o valor — sem aspas e sem `DATABASE_URL=`.

O script de build executa `prisma migrate deploy`; por isso, a Vercel aplica migrations pendentes no Neon durante o deploy. Não execute `npx prisma db seed` em produção.

## Tutorial do Neon

### 1. Crie um projeto

No painel do Neon, crie um projeto PostgreSQL para a API.

![Lista de projetos do Neon](./Assets/screenshots/screensht1.png)

### 2. Defina o projeto e a região

Informe o nome do projeto, escolha a região e mantenha o serviço **Postgres database** ativo.

![Criação de projeto no Neon](./Assets/screenshots/screenshot2.png)

### 3. Abra a branch de produção

Após criar o projeto, acesse a branch padrão para visualizar os recursos do banco.

![Visão geral da branch no Neon](./Assets/screenshots/screenshot3.png)

### 4. Copie a URL de conexão

Clique em **Connect**, selecione o formato Node.js e copie somente o valor da `DATABASE_URL`. Use-o no arquivo `.env` local e como variável secreta na Vercel.

![Janela de conexão do Neon](./Assets/screenshots/screenshot4.png)

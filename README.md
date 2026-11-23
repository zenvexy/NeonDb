# Esfiha Prime — Backend

API REST do Esfiha Prime, desenvolvida com Express, Prisma e PostgreSQL hospedado no [Neon DB](https://neon.com).

> Este backend complementa o [frontend do Esfiha Prime](web/README.md). A API fornece categorias e esfihas; a interface web consome essas rotas para gerenciar o cardápio.

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
3. Escolha uma das opções de banco abaixo e configure `DATABASE_URL` no ambiente **Production** e, se desejar, em **Preview**.
4. Faça um novo deploy.

### Opção 1: Prisma Postgres pela Vercel

Adicione a integração **Prisma Postgres** ao projeto da Vercel. Ela cria uma `DATABASE_URL` para o banco provisionado pela própria integração. Essa é a opção mais direta quando o banco será gerenciado pela Vercel.

### Opção 2: Neon DB conectado diretamente

No painel do Neon, abra o projeto e a branch que contém os seus dados. Clique em **Connect**, selecione o formato Node.js e copie somente a connection string PostgreSQL.

Na Vercel, abra **Settings → Environment Variables**, remova ou edite a `DATABASE_URL` criada pela integração Prisma Postgres e crie uma nova variável com:

- **Name:** `DATABASE_URL`
- **Value:** URL copiada do Neon
- **Environments:** Production e Preview
- **Sensitive:** ativado

Depois, faça um novo deploy. O front-end continuará chamando a API da Vercel; é a API que passará a consultar o Neon.

> O seed e a API publicada precisam usar a mesma `DATABASE_URL`. Se o seed for executado em um Neon e a Vercel usar outro banco, cada ambiente mostrará dados diferentes.

### Publicar pelo terminal

Dentro de `api/`, vincule e publique o projeto:

```bat
npx vercel login
npx vercel link
npx vercel --prod
```

Para cadastrar a URL do Neon pelo terminal, use:

```bat
npx vercel env add DATABASE_URL production
npx vercel env add DATABASE_URL preview
```

Quando o terminal solicitar o valor, cole somente a URL do Neon — sem aspas e sem `DATABASE_URL=`.

O script de build executa `prisma migrate deploy`; por isso, a Vercel aplica migrations pendentes no banco configurado pela `DATABASE_URL`. Não execute `npx prisma db seed` em produção.

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

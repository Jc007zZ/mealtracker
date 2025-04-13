# MealTracker - Controle suas refeições diárias

Aplicação full stack desenvolvida com NextJS (App Router) para registro e visualização de refeições diárias.

## Funcionalidades

- Registro de refeições com nome, descrição, calorias, data/hora e tipo
- Visualização de refeições em dashboard
- Filtragem por tipo de refeição (Café da manhã, almoço, lanche da tarde ou janta)
- Cálculo do total de calorias por dia
- Estatísticas por tipo de refeição
- Autenticação de usuários com Google (via AuthJS)

## Tecnologias Utilizadas

- NextJS com App Router
- API Routes internas do NextJS
- MongoDB Atlas
- TailwindCSS
- Auth.js v5 (NextAuth)
- Vercel (deploy)

## Configuração

### Pré-requisitos

- Node.js 18+ instalado
- Conta no MongoDB Atlas
- Projeto configurado no Google Cloud Console para OAuth

### Configuração do ambiente

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/meal-tracker.git
   cd meal-tracker
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   - Crie um arquivo `.env.local` na raiz do projeto
   - Preencha as seguintes variáveis:

   ```
   # MongoDB
   MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.mongodb.net/meal-tracker?retryWrites=true&w=majority

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000` no navegador.

## Deploy na Vercel

Esta aplicação está configurada para fácil deploy na Vercel:

1. Crie uma conta na Vercel
2. Conecte o repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy!

## Estrutura do Projeto

- `/app` - Páginas da aplicação (App Router)
- `/components` - Componentes reutilizáveis
- `/lib` - Funções de utilidade e configurações
- `/models` - Modelos do MongoDB
- `/api` - Rotas de API

## Licença

MIT

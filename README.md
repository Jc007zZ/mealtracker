# MealTracker - Controle suas refeições diárias

**Controle e visualize suas refeições diárias com facilidade!**  
Aplicação full stack com autenticação, estatísticas e muito mais.

## 🚀 Deploy na Vercel

Clique na imagem abaixo para visualizar o projeto online:

<a href="https://prisma-dusky-beta.vercel.app/dashboard" target="_blank">
  <img src="https://media.discordapp.net/attachments/1313924879070007457/1361689566733533327/screencapture-prisma-dusky-beta-vercel-app-dashboard-2025-04-15-10_04_51.png?ex=67ffabbb&is=67fe5a3b&hm=4aa692cfa2d37e4f1ae668407ee3a05244a230bb6c8ded12a16927563e08d348&=&format=webp&quality=lossless&width=1408&height=711" alt="Screenshot do projeto" />
</a>

## Funcionalidades

- Registro de refeições com nome, descrição, calorias, data/hora e tipo
- Visualização de refeições em dashboard
- Filtragem por tipo de refeição (Café da manhã, almoço, lanche da tarde ou janta)
- Cálculo do total de calorias por dia
- Estatísticas agregadas por macronutrientes
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


## Estrutura do Projeto

- `/app` - Páginas da aplicação (App Router)
- `/components` - Componentes reutilizáveis
- `/lib` - Funções de utilidade e configurações
- `/models` - Modelos do MongoDB
- `/api` - Rotas de API

## 📌 Propostas de Melhorias

Aqui estão algumas ideias para aprimorar ainda mais a experiência dos usuários com o MealTracker:

- 🍽️ **Refeições pré-cadastradas**  
  Oferecer uma lista de refeições comuns para o usuário selecionar rapidamente, facilitando o registro diário.

- 📊 **Gráfico de calorias semanais**  
  Utilizar bibliotecas como recharts ou chart.js para exibir visualmente o consumo de calorias ao longo da semana.

- 🔔 **Notificações com toast**  
  Integrar notificações amigáveis usando react-hot-toast ou sonner para informar ações como criação, edição e remoção de refeições.  
  Além disso, incluir lembretes para realizar refeições nos horários programados.

- 🔍 **Filtros aprimorados**  
  Permitir buscas por nome da refeição, quantidade de calorias, macro nutrientes e outros critérios para facilitar o gerenciamento alimentar.

- 📱 **PWA / Suporte offline**  
  Converter a aplicação em um Progressive Web App (PWA), permitindo uso offline por meio de cache local, melhorando a experiência mobile.

- 🌍 **Internacionalização (i18n)**  
  Adicionar suporte a múltiplos idiomas com next-intl ou next-i18next, começando com os idiomas Português (PT-BR) e Inglês (EN-US).

## Licença

MIT

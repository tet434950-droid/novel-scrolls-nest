# Esquecido Scan - Projeto Lovable

Um blog moderno e responsivo para publicação de novels (light novels, web novels) com sistema de gerenciamento de conteúdo integrado usando Decap/Netlify CMS.

## 📚 Funcionalidades

- **Sistema de Novels**: Organize suas histórias em novels separadas
- **Publicação de Capítulos**: Sistema completo de capítulos com navegação
- **CMS Integrado**: Interface administrativa para gerenciar conteúdo
- **Dark Mode**: Alternância entre modo claro e escuro
- **Modo Leitura**: Interface minimalista focada na leitura
- **Sistema de Comentários**: Comentários locais para cada capítulo
- **Busca**: Sistema de busca por títulos e conteúdo
- **Responsivo**: Design adaptado para desktop e mobile

## 🔧 Configuração do CMS

### Acesso ao CMS

1. **Local**: Acesse `http://localhost:5173/admin/`
2. **Produção**: Acesse `https://seusite.com/admin/`

### Configuração no Netlify

#### Opção 1: Netlify Identity (Recomendado)

1. **Deploy no Netlify**:
   - Conecte seu repositório GitHub ao Netlify
   - Faça o deploy do site

2. **Configurar Netlify Identity**:
   - No painel do Netlify, vá em: `Site settings > Identity`
   - Clique em `Enable Identity`
   - Em `Registration preferences`, selecione `Invite only`
   
3. **Configurar Git Gateway**:
   - Ainda em Identity, vá em `Services > Git Gateway`
   - Clique em `Enable Git Gateway`

4. **Criar usuário administrador**:
   - Vá em `Identity > Invite users`
   - Adicione seu email e envie o convite
   - Acesse o email e complete o cadastro

#### Opção 2: GitHub Backend com OAuth Self-Hosted (Não consome créditos do Netlify)

1. **Configuração OAuth no GitHub**:
   - Acesse GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - **Application name**: Novel Scrolls CMS
   - **Homepage URL**: `https://esquecidoscan.netlify.app`
   - **Authorization callback URL**: `https://esquecidoscan.netlify.app/.netlify/functions/decap-auth/callback`
   - Anote o **Client ID** e **Client Secret**

2. **Configuração no Netlify**:
   - No painel do Netlify, vá em Site settings → Environment variables
   - Adicione as variáveis:
     - `GITHUB_CLIENT_ID`: [seu client ID]
     - `GITHUB_CLIENT_SECRET`: [seu client secret]
     - `OAUTH_REDIRECT_URI`: `https://esquecidoscan.netlify.app/.netlify/functions/decap-auth/callback`

3. **Como usar**:
   - Deploy normalmente no Netlify
   - Acesse `/admin/` → clique em "Login with GitHub"
   - Autorize o OAuth App criado
   - Comece a editar seu conteúdo

4. **Vantagens**:
   - **Zero créditos consumidos** do Netlify (não usa Identity)
   - OAuth self-hosted com Netlify Functions
   - Login direto com GitHub
   - Commits vão direto na branch main

5. **Requisitos**:
   - Usuário deve ter permissão de **write** no repositório
   - OAuth App configurado no GitHub
   - Environment variables configuradas no Netlify

## 📝 Como adicionar conteúdo

### Adicionando uma Nova Novel

1. Acesse o CMS (`/admin/`)
2. Vá em "Novels" > "Lista de Novels"
3. Adicione um novo item com:
   - **ID**: Identificador único (ex: `minha-novel-1`)
   - **Título**: Nome da novel
   - **Slug**: URL amigável (ex: `minha-primeira-novel`)
   - **Descrição**: Sinopse da novel
   - **Autor**: Nome do autor
   - **Capa**: Imagem de capa (opcional)
   - **Status**: ativa, pausada ou concluída
   - **Gêneros**: Lista de gêneros (opcional)

### Adicionando um Capítulo

1. Acesse "Capítulos" > "Lista de Capítulos"
2. Adicione um novo item com:
   - **ID**: Identificador único do capítulo
   - **Novel ID**: Use o mesmo ID da novel (ex: `minha-novel-1`)
   - **Número**: Número sequencial do capítulo
   - **Título**: Título do capítulo
   - **Data**: Data e hora de publicação
   - **Texto**: Conteúdo em Markdown

## 📁 Estrutura CMS

```
public/
  admin/
    index.html          # Interface do CMS
    config.yml          # Configuração do CMS
  data/
    novels.json         # Dados das novels
    chapters.json       # Dados dos capítulos
  _redirects           # Configuração de rotas
```

## Project info

**URL**: https://lovable.dev/projects/d9da3019-4700-4a3d-bf7b-be0e7485b1f0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d9da3019-4700-4a3d-bf7b-be0e7485b1f0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d9da3019-4700-4a3d-bf7b-be0e7485b1f0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

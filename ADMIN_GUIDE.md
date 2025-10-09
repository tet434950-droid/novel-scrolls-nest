# Guia Completo do Painel Admin

## 📋 Visão Geral

Painel administrativo completo em português para gerenciamento de obras literárias (novels) e capítulos, com sistema de publicação e leitura pública.

## 🚀 Início Rápido

1. Acesse `/auth` e crie sua conta
2. Promova seu usuário para admin via SQL:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('SEU_USER_ID', 'admin');
```
3. Acesse `/admin` para começar

## 📚 Recursos Principais

### Painel Principal (`/admin`)
- Total de obras e capítulos
- Rascunhos vs. publicados (com cores indicativas)
- Acesso rápido às funcionalidades

### Gerenciar Obras (`/admin/novels`)
- Criar, editar, excluir obras
- Busca por título/slug
- Status visual (verde=publicado, amarelo=rascunho)
- Novos campos: gênero, sinopse, tags

### Editor de Capítulos
- Markdown com prévia
- Contador de palavras em tempo real
- Salvamento automático (10s)
- Subtítulo opcional
- Agendamento de publicação

## 🌐 Rotas Públicas

- `/obras` - Lista de obras publicadas
- `/obras/:slug` - Detalhes da obra
- `/obras/:slug/:chapterSlug` - Leitura do capítulo

## 🔌 API REST

Base: `https://tuefyvxnezpiyvvilwrc.supabase.co/functions/v1/api-obras`

- `GET /` - Todas as obras
- `GET /:slug` - Obra + capítulos
- `GET /:slug/:chapterSlug` - Conteúdo do capítulo

Retorna apenas conteúdo publicado.

## 🔒 Segurança

- Autenticação obrigatória no admin
- RLS policies ativas
- API pública somente leitura

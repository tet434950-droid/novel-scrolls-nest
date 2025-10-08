# Configuração do Painel Admin

## Primeiro Acesso

Para acessar o painel administrativo pela primeira vez, siga estes passos:

### 1. Criar sua conta
1. Acesse `/auth` no seu navegador
2. Clique na aba "Cadastro"
3. Insira seu email e senha (mínimo 6 caracteres)
4. Clique em "Criar conta"

### 2. Tornar-se Admin

Após criar sua conta, você precisa adicionar a role de admin manualmente no banco de dados:

1. Abra o backend do Lovable Cloud clicando no botão "Cloud" no canto inferior esquerdo da interface
2. Vá para a aba "Database" > "SQL Editor"
3. Execute o seguinte comando SQL (substitua `SEU_EMAIL@exemplo.com` pelo email que você cadastrou):

```sql
-- Buscar o ID do seu usuário
SELECT id, email FROM auth.users WHERE email = 'SEU_EMAIL@exemplo.com';

-- Copie o ID retornado e use no comando abaixo (substitua 'UUID_DO_USUARIO')
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DO_USUARIO', 'admin');
```

**Exemplo completo:**

```sql
-- 1. Primeiro, encontre seu ID de usuário:
SELECT id, email FROM auth.users WHERE email = 'admin@exemplo.com';

-- Resultado exemplo:
-- id: 123e4567-e89b-12d3-a456-426614174000
-- email: admin@exemplo.com

-- 2. Agora adicione a role de admin:
INSERT INTO public.user_roles (user_id, role)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'admin');
```

### 3. Acessar o Painel

1. Faça logout e login novamente
2. Acesse `/admin` ou clique no botão "Admin" no cabeçalho
3. Você agora tem acesso completo ao painel administrativo!

## Funcionalidades do Painel Admin

### Dashboard (`/admin`)
- Visualização de estatísticas gerais
- Total de novels e capítulos
- Status de publicações
- Acesso rápido às funções de gerenciamento

### Gerenciamento de Novels (`/admin/novels`)
- **Criar Nova Novel**: Título, descrição, capa, categoria, autor, status
- **Editar Novel**: Atualizar informações existentes
- **Excluir Novel**: Remove a novel e todos os capítulos associados
- **Buscar**: Filtro por título ou slug
- **Upload de Capa**: Suporte para imagens PNG, JPG, WEBP

### Gerenciamento de Capítulos (`/admin/novels/:id/chapters`)
- **Criar Capítulo**: Editor de texto com suporte a Markdown
- **Editar Capítulo**: Atualizar conteúdo e metadados
- **Excluir Capítulo**: Remover capítulos individuais
- **Ordenação**: Reordenar capítulos por número
- **Status**: Rascunho ou Publicado
- **Agendamento**: Publicar em data/hora específica
- **Autosave**: Salva automaticamente a cada 10 segundos
- **Preview**: Visualizar o capítulo antes de publicar
- **Contador de Palavras**: Acompanhe o tamanho do conteúdo

### Recursos Avançados

#### Slugs Automáticos
Os slugs são gerados automaticamente baseados nos títulos, mas podem ser editados manualmente.

#### Agendamento de Publicação
Defina uma data e hora futura para publicar capítulos automaticamente.

#### Upload de Imagens
- Capas de novels são armazenadas no bucket `novel-covers`
- Imagens de capítulos podem ser adicionadas no bucket `chapter-images`

#### Políticas de Segurança (RLS)
- Apenas administradores podem criar, editar ou excluir conteúdo
- O público pode visualizar apenas conteúdo publicado
- Capítulos agendados só aparecem após a data de publicação

## API Pública (Read-Only)

As seguintes rotas da API estão disponíveis publicamente (sem necessidade de autenticação):

### Novels
```javascript
// Listar todas as novels publicadas
const { data } = await supabase
  .from('novels')
  .select('*')
  .eq('status', 'published');

// Buscar novel por slug
const { data } = await supabase
  .from('novels')
  .select('*')
  .eq('slug', 'minha-novel')
  .single();
```

### Capítulos
```javascript
// Listar capítulos de uma novel (apenas publicados)
const { data } = await supabase
  .from('chapters')
  .select('*')
  .eq('novel_id', novelId)
  .eq('status', 'published')
  .eq('is_published', true)
  .order('chapter_number', { ascending: true });

// Buscar capítulo específico
const { data } = await supabase
  .from('chapters')
  .select('*')
  .eq('novel_id', novelId)
  .eq('slug', 'capitulo-1')
  .eq('status', 'published')
  .single();
```

## Segurança

### Autenticação
- Email/senha via Supabase Auth
- Auto-confirmação de email habilitada (para desenvolvimento)
- Sessões persistentes com refresh automático

### Controle de Acesso
- Sistema de roles baseado em tabela `user_roles`
- RLS (Row Level Security) em todas as tabelas
- Funções SECURITY DEFINER para verificação de permissões
- Storage com políticas de acesso restritas a admins

### Validações
- Títulos obrigatórios
- Slugs únicos por entidade
- Números de capítulos únicos por novel
- Senhas com mínimo de 6 caracteres

## Adicionar Mais Administradores

Para adicionar outros usuários como administradores:

```sql
-- Depois que o usuário criar a conta dele via /auth
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DO_NOVO_ADMIN', 'admin');
```

## Suporte e Troubleshooting

### Problema: Não consigo fazer login
- Verifique se o email está correto
- Tente resetar a senha
- Confirme que auto-confirm está habilitado nas configurações de Auth

### Problema: Login funciona mas não acessa o admin
- Verifique se a role de admin foi adicionada corretamente
- Execute: `SELECT * FROM user_roles WHERE user_id = 'SEU_USER_ID';`
- Faça logout e login novamente

### Problema: Upload de imagens não funciona
- Verifique as políticas de storage
- Confirme que você está autenticado como admin
- Verifique se os buckets `novel-covers` e `chapter-images` existem

### Problema: Capítulos publicados não aparecem no site
- Verifique se `status = 'published'` e `is_published = true`
- Se agendado, confirme que `publish_at <= NOW()`
- Limpe o cache do navegador

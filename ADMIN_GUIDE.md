# Guia do Sistema Administrativo - Esquecido Scan

## Como acessar o painel administrativo

1. Clique no botão flutuante **"Admin"** no canto inferior direito de qualquer página
2. Ou acesse diretamente `/admin/` no seu navegador
3. Faça login com sua conta GitHub (necessário ter acesso ao repositório)

## Gerenciamento de Novels

### Criar uma nova novel:
1. No painel admin, clique em **"Novels"**
2. Clique em **"New Novels"**
3. Preencha os campos obrigatórios:
   - **ID**: Identificador único (ex: `minha-novel-1`)
   - **Título**: Nome da novel
   - **Slug**: URL amigável (ex: `minha-novel`)
   - **Descrição**: Breve descrição da história
   - **Autor**: Nome do autor
   - **Categoria**: Escolha entre Cultivo, LitRPG, Fantasia, etc.
   - **Status**: ongoing, completed ou hiatus
4. Clique em **"Publish"**

### Editar uma novel existente:
1. Na lista de novels, clique na novel que deseja editar
2. Faça as alterações necessárias
3. Clique em **"Publish"**

## Gerenciamento de Capítulos

### Criar um novo capítulo:
1. No painel admin, clique em **"Capítulos"**
2. Clique em **"New Capítulos"**
3. Preencha os campos:
   - **ID**: Identificador único (ex: `chapter-1-novel-1`)
   - **ID da Novel**: ID da novel a que pertence
   - **Título da Novel**: Nome da novel
   - **Título do Capítulo**: Título específico do capítulo
   - **Slug**: URL do capítulo
   - **Número do Capítulo**: Número sequencial
   - **Conteúdo**: Texto completo do capítulo (suporte a Markdown)
4. Clique em **"Publish"**

### Dicas para escrita:
- Use Markdown para formatação (títulos, negrito, itálico, etc.)
- O sistema calcula automaticamente a contagem de palavras
- Você pode salvar como rascunho e publicar depois

## Recursos Disponíveis

- ✅ Criar, editar e excluir novels
- ✅ Criar, editar e excluir capítulos  
- ✅ Upload de imagens de capa
- ✅ Sistema de categorias
- ✅ Controle de status (em andamento, completo, hiato)
- ✅ Editor Markdown integrado
- ✅ Preview em tempo real
- ✅ Versionamento automático via Git

## Estrutura de arquivos

- `data/novels/`: Arquivos das novels (formato Markdown)
- `data/chapters/`: Arquivos dos capítulos (formato Markdown)
- `public/uploads/`: Imagens e outros arquivos enviados

## Suporte

Se tiver dúvidas ou problemas, verifique:
1. Se você tem permissões no repositório GitHub
2. Se os campos obrigatórios estão preenchidos
3. Se a conexão com a internet está estável

O sistema sincroniza automaticamente com o GitHub, então todas as mudanças são versionadas e podem ser revertidas se necessário.
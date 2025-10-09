-- Adicionar novos campos à tabela novels
ALTER TABLE novels ADD COLUMN IF NOT EXISTS genre text;
ALTER TABLE novels ADD COLUMN IF NOT EXISTS synopsis text;
ALTER TABLE novels ADD COLUMN IF NOT EXISTS tags text;

-- Adicionar campos à tabela chapters
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS subtitle text;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Criar índice para ordenação de capítulos
CREATE INDEX IF NOT EXISTS idx_chapters_display_order ON chapters(novel_id, display_order);

-- Atualizar display_order com base no chapter_number existente
UPDATE chapters SET display_order = chapter_number WHERE display_order = 0;
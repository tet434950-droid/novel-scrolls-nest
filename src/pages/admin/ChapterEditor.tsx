import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChapterEditor() {
  const { novelId, chapterId } = useParams();
  const isEdit = !!chapterId;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [novelTitle, setNovelTitle] = useState('');
  const [nextChapterNumber, setNextChapterNumber] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    chapter_number: 1,
    content: '',
    status: 'draft' as 'draft' | 'published',
    is_published: false,
    publish_at: null as string | null
  });

  useEffect(() => {
    fetchNovel();
    if (isEdit) {
      fetchChapter();
    } else {
      fetchNextChapterNumber();
    }
  }, [novelId, chapterId]);

  useEffect(() => {
    const wordCount = formData.content.trim().split(/\s+/).length;
    // Auto-save every 10 seconds
    const timer = setTimeout(() => {
      if (isEdit && formData.content) {
        saveChapter(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [formData.content]);

  const fetchNovel = async () => {
    const { data } = await supabase
      .from('novels')
      .select('title')
      .eq('id', novelId)
      .single();
    
    if (data) {
      setNovelTitle(data.title);
    }
  };

  const fetchNextChapterNumber = async () => {
    const { data } = await supabase
      .from('chapters')
      .select('chapter_number')
      .eq('novel_id', novelId)
      .order('chapter_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextNumber = data ? data.chapter_number + 1 : 1;
    setNextChapterNumber(nextNumber);
    setFormData(prev => ({ ...prev, chapter_number: nextNumber }));
  };

  const fetchChapter = async () => {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();

    if (error) {
      toast({
        title: 'Erro ao carregar capítulo',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setFormData(data);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const saveChapter = async (isAutosave = false) => {
    const wordCount = formData.content.trim().split(/\s+/).filter(w => w).length;
    
    const chapterData = {
      ...formData,
      novel_id: novelId,
      novel_title: novelTitle,
      word_count: wordCount
    };

    if (isEdit) {
      const { error } = await supabase
        .from('chapters')
        .update(chapterData)
        .eq('id', chapterId);

      if (error && !isAutosave) {
        toast({
          title: 'Erro ao atualizar capítulo',
          description: error.message,
          variant: 'destructive'
        });
      } else if (!isAutosave) {
        toast({
          title: 'Capítulo atualizado',
          description: 'O capítulo foi atualizado com sucesso.'
        });
        navigate(`/admin/novels/${novelId}/chapters`);
      }
    } else {
      const { error } = await supabase
        .from('chapters')
        .insert([chapterData]);

      if (error) {
        toast({
          title: 'Erro ao criar capítulo',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Capítulo criado',
          description: 'O capítulo foi criado com sucesso.'
        });
        navigate(`/admin/novels/${novelId}/chapters`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await saveChapter();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={`/admin/novels/${novelId}/chapters`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {isEdit ? 'Editar Capítulo' : 'Novo Capítulo'}
            </h1>
            <p className="text-sm text-muted-foreground">{novelTitle}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? 'Editar Capítulo' : `Criar Capítulo ${nextChapterNumber}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter_number">Número do Capítulo *</Label>
                  <Input
                    id="chapter_number"
                    type="number"
                    min="1"
                    value={formData.chapter_number}
                    onChange={(e) => setFormData({ ...formData, chapter_number: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published') =>
                      setFormData({ ...formData, status: value, is_published: value === 'published' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publish_at">Agendamento (opcional)</Label>
                <Input
                  id="publish_at"
                  type="datetime-local"
                  value={formData.publish_at || ''}
                  onChange={(e) => setFormData({ ...formData, publish_at: e.target.value || null })}
                />
              </div>

              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="space-y-2">
                  <Label htmlFor="content">Conteúdo (Markdown) *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={20}
                    className="font-mono"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Palavras: {formData.content.trim().split(/\s+/).filter(w => w).length}
                  </p>
                </TabsContent>
                <TabsContent value="preview" className="space-y-2">
                  <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg min-h-[500px]">
                    <p className="whitespace-pre-wrap">{formData.content || 'Digite algo no editor para ver o preview...'}</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
                </Button>
                <Link to={`/admin/novels/${novelId}/chapters`}>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
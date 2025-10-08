import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = ['Cultivo', 'LitRPG', 'Fantasia', 'Ação', 'Romance', 'Mistério'];

export default function NovelForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    author: '',
    category: '',
    status: 'draft' as 'draft' | 'published',
    cover_image: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchNovel();
    }
  }, [id]);

  const fetchNovel = async () => {
    const { data, error } = await supabase
      .from('novels')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: 'Erro ao carregar novel',
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('novel-covers')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: 'Erro ao fazer upload',
        description: uploadError.message,
        variant: 'destructive'
      });
    } else {
      const { data } = supabase.storage
        .from('novel-covers')
        .getPublicUrl(fileName);

      setFormData({ ...formData, cover_image: data.publicUrl });
      toast({
        title: 'Upload concluído',
        description: 'Imagem enviada com sucesso.'
      });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isEdit) {
      const { error } = await supabase
        .from('novels')
        .update(formData)
        .eq('id', id);

      if (error) {
        toast({
          title: 'Erro ao atualizar novel',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Novel atualizada',
          description: 'A novel foi atualizada com sucesso.'
        });
        navigate('/admin/novels');
      }
    } else {
      const { error } = await supabase
        .from('novels')
        .insert([formData]);

      if (error) {
        toast({
          title: 'Erro ao criar novel',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Novel criada',
          description: 'A novel foi criada com sucesso.'
        });
        navigate('/admin/novels');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/admin/novels">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Editar Novel' : 'Nova Novel'}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Editar Novel' : 'Criar Nova Novel'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <p className="text-sm text-muted-foreground">
                  URL amigável (gerado automaticamente)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">Imagem de Capa</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {formData.cover_image && (
                  <img
                    src={formData.cover_image}
                    alt="Prévia da capa"
                    className="mt-2 w-32 h-48 object-cover rounded"
                  />
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading || uploading}>
                  {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
                </Button>
                <Link to="/admin/novels">
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
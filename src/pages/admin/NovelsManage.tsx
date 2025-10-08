import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Novel {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  status: 'draft' | 'published';
  total_chapters: number;
  created_at: string;
}

export default function NovelsManage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNovels();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredNovels(
        novels.filter(novel =>
          novel.title.toLowerCase().includes(search.toLowerCase()) ||
          novel.slug.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredNovels(novels);
    }
  }, [search, novels]);

  const fetchNovels = async () => {
    const { data, error } = await supabase
      .from('novels')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast({
        title: 'Erro ao carregar novels',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setNovels(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from('novels')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        title: 'Erro ao excluir novel',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Novel excluída',
        description: 'A novel foi excluída com sucesso.'
      });
      fetchNovels();
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Gerenciar Novels</h1>
          </div>
          <Link to="/admin/novels/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Novel
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capítulos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNovels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma novel encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNovels.map((novel) => (
                    <TableRow key={novel.id}>
                      <TableCell className="font-medium">{novel.title}</TableCell>
                      <TableCell>{novel.author}</TableCell>
                      <TableCell>{novel.category}</TableCell>
                      <TableCell>
                        <Badge variant={novel.status === 'published' ? 'default' : 'secondary'}>
                          {novel.status === 'published' ? 'Publicada' : 'Rascunho'}
                        </Badge>
                      </TableCell>
                      <TableCell>{novel.total_chapters}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/novels/${novel.id}/chapters`}>
                            <Button variant="outline" size="sm">
                              Capítulos
                            </Button>
                          </Link>
                          <Link to={`/admin/novels/${novel.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(novel.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta novel? Esta ação não pode ser desfeita e
              todos os capítulos associados também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
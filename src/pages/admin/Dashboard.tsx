import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, FileText, FilePlus, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalNovels: 0,
    publishedNovels: 0,
    totalChapters: 0,
    publishedChapters: 0,
    draftChapters: 0
  });
  const { signOut } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [novelsResult, chaptersResult] = await Promise.all([
      supabase.from('novels').select('status', { count: 'exact' }),
      supabase.from('chapters').select('status', { count: 'exact' })
    ]);

    const publishedNovels = novelsResult.data?.filter(n => n.status === 'published').length || 0;
    const publishedChapters = chaptersResult.data?.filter(c => c.status === 'published').length || 0;
    const draftChapters = chaptersResult.data?.filter(c => c.status === 'draft').length || 0;

    setStats({
      totalNovels: novelsResult.count || 0,
      publishedNovels,
      totalChapters: chaptersResult.count || 0,
      publishedChapters,
      draftChapters
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Novels</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNovels}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedNovels} publicadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Capítulos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalChapters}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedChapters} publicados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
              <FilePlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draftChapters}</div>
              <p className="text-xs text-muted-foreground">
                Capítulos não publicados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publicados</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedChapters}</div>
              <p className="text-xs text-muted-foreground">
                Capítulos ao vivo
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Novels</CardTitle>
              <CardDescription>
                Criar, editar e excluir novels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/novels">
                <Button className="w-full">
                  <Book className="mr-2 h-4 w-4" />
                  Ver Novels
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Capítulos</CardTitle>
              <CardDescription>
                Criar, editar e excluir capítulos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/novels">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Capítulos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
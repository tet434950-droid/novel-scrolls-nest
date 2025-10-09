import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BlogHeader from '@/components/BlogHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Novel {
  id: string;
  title: string;
  slug: string;
  description: string;
  synopsis: string;
  author: string;
  category: string;
  genre: string;
  tags: string;
  cover_image: string;
  total_chapters: number;
  status: string;
}

export default function Obras() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNovels();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredNovels(
        novels.filter((novel) =>
          novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          novel.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          novel.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredNovels(novels);
    }
  }, [searchTerm, novels]);

  const fetchNovels = async () => {
    const { data, error } = await supabase
      .from('novels')
      .select('*')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar obras:', error);
    } else {
      setNovels(data || []);
      setFilteredNovels(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Obras Publicadas</h1>
          <Input
            placeholder="Buscar obras por título, autor ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Carregando obras...</p>
        ) : filteredNovels.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhuma obra encontrada.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNovels.map((novel) => (
              <Link key={novel.id} to={`/obras/${novel.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    {novel.cover_image && (
                      <img
                        src={novel.cover_image}
                        alt={novel.title}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2">{novel.title}</h2>
                      <p className="text-sm text-muted-foreground mb-2">Por {novel.author}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {novel.category && (
                          <Badge variant="secondary">{novel.category}</Badge>
                        )}
                        {novel.genre && (
                          <Badge variant="outline">{novel.genre}</Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground line-clamp-3">
                        {novel.description || novel.synopsis}
                      </p>

                      <div className="mt-4 text-sm text-muted-foreground">
                        {novel.total_chapters} capítulos
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

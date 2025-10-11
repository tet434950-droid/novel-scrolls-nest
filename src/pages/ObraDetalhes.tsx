import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BlogHeader from '@/components/BlogHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';

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

interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  chapter_number: number;
  word_count: number;
  publish_at: string;
  is_published: boolean;
}

export default function ObraDetalhes() {
  const { slug } = useParams();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchNovelAndChapters();
    }
  }, [slug]);

  const fetchNovelAndChapters = async () => {
    const { data: novelData, error: novelError } = await supabase
      .from('novels')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (novelError) {
      console.error('Erro ao carregar obra:', novelError);
      setLoading(false);
      return;
    }

    setNovel(novelData);

    const { data: chaptersData, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('novel_id', novelData.id)
      .eq('status', 'published')
      .eq('is_published', true)
      .or(`publish_at.is.null,publish_at.lte.${new Date().toISOString()}`)
      .order('chapter_number', { ascending: true });

    if (chaptersError) {
      console.error('Erro ao carregar capítulos:', chaptersError);
    } else {
      setChapters(chaptersData || []);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader onSearch={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </main>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader onSearch={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Obra não encontrada.</p>
              <Link to="/obras">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Obras
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const tags = novel.tags ? novel.tags.split(',').map(t => t.trim()).filter(t => t) : [];

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/obras">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            {novel.cover_image && (
              <img
                src={novel.cover_image}
                alt={novel.title}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-2">{novel.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">Por {novel.author}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {novel.category && (
                <Badge variant="secondary">{novel.category}</Badge>
              )}
              {novel.genre && (
                <Badge variant="outline">{novel.genre}</Badge>
              )}
              {tags.map((tag, idx) => (
                <Badge key={idx} variant="outline">{tag}</Badge>
              ))}
            </div>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Sinopse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{novel.synopsis || novel.description}</p>
              </CardContent>
            </Card>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span><BookOpen className="inline h-4 w-4 mr-1" />{chapters.length} capítulos publicados</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Capítulos</CardTitle>
          </CardHeader>
          <CardContent>
            {chapters.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum capítulo publicado ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    to={`/obras/${slug}/${chapter.slug}`}
                    className="block p-4 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          Capítulo {chapter.chapter_number}: {chapter.title}
                        </h3>
                        {chapter.subtitle && (
                          <p className="text-sm text-muted-foreground">{chapter.subtitle}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {chapter.word_count} palavras
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

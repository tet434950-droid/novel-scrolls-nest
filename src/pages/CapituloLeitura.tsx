import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BlogHeader from '@/components/BlogHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Chapter {
  id: string;
  novel_id: string;
  title: string;
  subtitle: string;
  slug: string;
  chapter_number: number;
  content: string;
  word_count: number;
  novel_title: string;
}

export default function CapituloLeitura() {
  const { slug, chapterSlug } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug && chapterSlug) {
      fetchChapter();
    }
  }, [slug, chapterSlug]);

  const fetchChapter = async () => {
    // Buscar capítulo atual
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('slug', chapterSlug)
      .eq('status', 'published')
      .eq('is_published', true)
      .lte('publish_at', new Date().toISOString())
      .single();

    if (chapterError || !chapterData) {
      console.error('Erro ao carregar capítulo:', chapterError);
      setLoading(false);
      return;
    }

    setChapter(chapterData);

    // Buscar próximo capítulo
    const { data: nextData } = await supabase
      .from('chapters')
      .select('*')
      .eq('novel_id', chapterData.novel_id)
      .eq('status', 'published')
      .eq('is_published', true)
      .gt('chapter_number', chapterData.chapter_number)
      .lte('publish_at', new Date().toISOString())
      .order('chapter_number', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextData) {
      setNextChapter(nextData);
    }

    setLoading(false);
  };

  const handleNextChapter = () => {
    if (nextChapter && slug) {
      navigate(`/obras/${slug}/${nextChapter.slug}`);
    }
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

  if (!chapter) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader onSearch={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Capítulo não encontrado.</p>
              <Link to={`/obras/${slug}`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para a Obra
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to={`/obras/${slug}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para {chapter.novel_title}
          </Button>
        </Link>

        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="mb-6 pb-6 border-b">
              <p className="text-sm text-muted-foreground mb-2">{chapter.novel_title}</p>
              <h1 className="text-3xl font-bold mb-2">
                Capítulo {chapter.chapter_number}: {chapter.title}
              </h1>
              {chapter.subtitle && (
                <p className="text-lg text-muted-foreground">{chapter.subtitle}</p>
              )}
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed font-serif">
                {chapter.content}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex justify-between items-center">
              <Link to={`/obras/${slug}`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Índice
                </Button>
              </Link>

              {nextChapter && (
                <Button onClick={handleNextChapter}>
                  Próximo Capítulo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

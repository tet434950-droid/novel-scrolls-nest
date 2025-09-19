import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Eye, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommentSection from '@/components/CommentSection';
import ReadingModeToggle from '@/components/ReadingModeToggle';
import { useToast } from '@/hooks/use-toast';
import { useReadingMode } from '@/contexts/ReadingModeContext';
import { useChapters } from '@/hooks/useContent';
import { cn } from '@/lib/utils';

export default function Chapter() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { isReadingMode, fontSize } = useReadingMode();
  const { chapters, loading } = useChapters();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-content-secondary">Carregando capítulo...</p>
      </div>
    );
  }
  
  const chapter = chapters.find(c => c.slug === slug);
  
  if (!chapter) {
    return <Navigate to="/404" replace />;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min de leitura`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${chapter.title} - ${chapter.novelTitle}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copiado!',
        description: 'O link do capítulo foi copiado para a área de transferência.',
      });
    }
  };

  // Find previous and next chapters
  const allChapters = chapters
    .filter(c => c.novelId === chapter.novelId)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
  
  const currentIndex = allChapters.findIndex(c => c.id === chapter.id);
  const previousChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <div className={cn("min-h-screen", isReadingMode ? "reading-mode-minimal" : "bg-background")}>
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8 py-8", isReadingMode ? "max-w-4xl" : "max-w-4xl")}>
        {/* Navigation & Reading Mode Toggle */}
        <div className="mb-8 flex justify-between items-center">
          <Link 
            to="/"
            className="inline-flex items-center text-accent hover:text-accent-hover font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          
          <ReadingModeToggle />
        </div>

        {/* Chapter Header */}
        {!isReadingMode && (
          <header className="mb-8">
            <div className="mb-4">
              <Link
                to={`/novel/${chapter.novelTitle.toLowerCase().replace(/\s+/g, '-')}`}
                className="novel-badge hover:bg-accent-light/80 transition-colors"
              >
                {chapter.novelTitle}
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-content-primary mb-4 leading-tight">
              Capítulo {chapter.chapterNumber}: {chapter.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-content-secondary">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formatDate(chapter.publishedAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm">{getReadingTime(chapter.wordCount)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{chapter.wordCount} palavras</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="ml-auto"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </header>
        )}

        {/* Reading Mode Header (minimal) */}
        {isReadingMode && (
          <header className="mb-12 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-content-primary mb-2 leading-tight">
              Capítulo {chapter.chapterNumber}: {chapter.title}
            </h1>
            <p className="text-content-tertiary text-sm">
              {chapter.novelTitle}
            </p>
          </header>
        )}

        {/* Chapter Content */}
        <article className={cn(
          "mb-8 rounded-2xl shadow-sm",
          isReadingMode 
            ? "chapter-content bg-transparent p-0" 
            : "bg-surface p-8 md:p-12 border border-border-subtle"
        )}>
          <div className={cn(
            "prose prose-lg max-w-none",
            isReadingMode ? "reading-mode" : ""
          )}>
            <div 
              className={cn(
                "text-content-primary leading-relaxed",
                isReadingMode ? "prose-enhanced" : "prose-content"
              )}
              style={{ 
                fontFamily: "'Crimson Text', Georgia, serif", 
                lineHeight: isReadingMode ? 1.8 : 1.7,
                fontSize: isReadingMode ? `${fontSize}px` : undefined
              }}
            >
              {chapter.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 
                      key={index} 
                      className="text-2xl font-bold mb-6 mt-8 first:mt-0"
                      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                      {paragraph.slice(2)}
                    </h1>
                  );
                }
                if (paragraph.trim() === '') {
                  return <br key={index} />;
                }
                if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                  return (
                    <p key={index} className="italic text-content-secondary my-4 text-center">
                      {paragraph.slice(1, -1)}
                    </p>
                  );
                }
                return (
                  <p key={index} className="mb-4 text-lg">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </article>

        {/* Chapter Navigation */}
        {!isReadingMode && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-6 bg-surface rounded-xl border border-border-subtle">
            <div className="flex-1">
              {previousChapter ? (
                <Link
                  to={`/chapter/${previousChapter.slug}`}
                  className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-subtle transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-accent" />
                  <div className="text-left">
                    <p className="text-sm text-content-tertiary">Capítulo anterior</p>
                    <p className="font-medium text-content-primary group-hover:text-accent transition-colors">
                      Cap. {previousChapter.chapterNumber}: {previousChapter.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="text-content-tertiary">
                  <p className="text-sm">Primeiro capítulo</p>
                </div>
              )}
            </div>

            <div className="flex-1 text-right">
              {nextChapter ? (
                <Link
                  to={`/chapter/${nextChapter.slug}`}
                  className="group flex items-center justify-end space-x-3 p-3 rounded-lg hover:bg-surface-subtle transition-colors"
                >
                  <div className="text-right">
                    <p className="text-sm text-content-tertiary">Próximo capítulo</p>
                    <p className="font-medium text-content-primary group-hover:text-accent transition-colors">
                      Cap. {nextChapter.chapterNumber}: {nextChapter.title}
                    </p>
                  </div>
                  <svg className="h-5 w-5 text-accent transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              ) : (
                <div className="text-content-tertiary">
                  <p className="text-sm">Último capítulo</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reading Mode Navigation (minimal) */}
        {isReadingMode && (
          <div className="flex justify-between items-center py-8 border-t border-border-subtle">
            {previousChapter ? (
              <Link
                to={`/chapter/${previousChapter.slug}`}
                className="text-accent hover:text-accent-hover font-medium"
              >
                ← Capítulo Anterior
              </Link>
            ) : (
              <span className="text-content-tertiary">Primeiro capítulo</span>
            )}

            {nextChapter ? (
              <Link
                to={`/chapter/${nextChapter.slug}`}
                className="text-accent hover:text-accent-hover font-medium"
              >
                Próximo Capítulo →
              </Link>
            ) : (
              <span className="text-content-tertiary">Último capítulo</span>
            )}
          </div>
        )}

        {/* Comments Section - Hidden in reading mode */}
        {!isReadingMode && <CommentSection chapterId={chapter.id} />}
      </div>
    </div>
  );
}
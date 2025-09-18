import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Calendar, User, CheckCircle, Clock, Pause } from 'lucide-react';
import ChapterCard from '@/components/ChapterCard';
import { mockNovels, mockChapters } from '@/data/mockData';

export default function NovelPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const novel = mockNovels.find(n => n.slug === slug);
  
  if (!novel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-content-primary mb-4">Novel não encontrada</h1>
          <Link to="/" className="text-accent hover:text-accent-hover">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const novelChapters = mockChapters
    .filter(c => c.novelId === novel.id)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'ongoing':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'hiatus':
        return <Pause className="h-5 w-5 text-yellow-600" />;
      default:
        return <Book className="h-5 w-5 text-content-tertiary" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completa';
      case 'ongoing':
        return 'Em andamento';
      case 'hiatus':
        return 'Em hiato';
      default:
        return 'Status desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center text-accent hover:text-accent-hover font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
        </div>

        {/* Novel Header */}
        <header className="mb-12">
          <div className="bg-surface rounded-2xl p-8 md:p-12 border border-border-subtle">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Novel Cover (placeholder) */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] bg-accent-light rounded-xl flex items-center justify-center">
                  <Book className="h-16 w-16 text-accent" />
                </div>
              </div>

              {/* Novel Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    {getStatusIcon(novel.status)}
                    <span className="text-sm font-medium text-content-secondary">
                      {getStatusText(novel.status)}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-content-primary mb-4">
                    {novel.title}
                  </h1>
                  
                  <p className="text-lg text-content-secondary leading-relaxed">
                    {novel.description}
                  </p>
                </div>

                {/* Novel Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-content-tertiary" />
                      <span className="text-content-secondary">
                        <strong>Autor:</strong> {novel.author}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Book className="h-5 w-5 text-content-tertiary" />
                      <span className="text-content-secondary">
                        <strong>Categoria:</strong> {novel.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-content-tertiary" />
                      <span className="text-content-secondary">
                        <strong>Criada em:</strong> {formatDate(novel.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-content-tertiary" />
                      <span className="text-content-secondary">
                        <strong>Capítulos:</strong> {novelChapters.length} de {novel.totalChapters}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Chapters Section */}
        <section>
          <h2 className="text-2xl font-bold text-content-primary mb-8">
            Capítulos ({novelChapters.length})
          </h2>

          {novelChapters.length === 0 ? (
            <div className="text-center py-16">
              <Book className="h-16 w-16 text-content-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-content-primary mb-2">
                Nenhum capítulo publicado ainda
              </h3>
              <p className="text-content-secondary">
                Os capítulos aparecerão aqui assim que forem publicados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {novelChapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
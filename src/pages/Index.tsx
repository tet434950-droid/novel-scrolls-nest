import { useState, useMemo } from 'react';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import BlogHeader from '@/components/BlogHeader';
import ChapterCard from '@/components/ChapterCard';
import { mockChapters } from '@/data/mockData';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sort chapters by publication date (newest first)
  const sortedChapters = useMemo(() => {
    return [...mockChapters]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, []);

  // Filter chapters based on search query
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return sortedChapters;
    
    const query = searchQuery.toLowerCase();
    return sortedChapters.filter(chapter =>
      chapter.title.toLowerCase().includes(query) ||
      chapter.novelTitle.toLowerCase().includes(query) ||
      chapter.content.toLowerCase().includes(query)
    );
  }, [sortedChapters, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-accent mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-content-primary">
                Novel Blog
              </h1>
            </div>
            <p className="text-xl text-content-secondary leading-relaxed">
              Descubra mundos fascinantes através de capítulos envolventes. 
              Acompanhe suas novels favoritas e mergulhe em histórias épicas.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-xl p-6 border border-border-subtle text-center">
              <BookOpen className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-content-primary mb-1">
                {mockChapters.length}
              </h3>
              <p className="text-content-secondary">Capítulos publicados</p>
            </div>
            
            <div className="bg-surface rounded-xl p-6 border border-border-subtle text-center">
              <Sparkles className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-content-primary mb-1">3</h3>
              <p className="text-content-secondary">Novels ativas</p>
            </div>
            
            <div className="bg-surface rounded-xl p-6 border border-border-subtle text-center">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-content-primary mb-1">
                {mockChapters.reduce((acc, ch) => acc + ch.wordCount, 0).toLocaleString()}
              </h3>
              <p className="text-content-secondary">Palavras escritas</p>
            </div>
          </div>
        </section>

        {/* Chapters Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-content-primary">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Capítulos Recentes'}
            </h2>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-accent hover:text-accent-hover font-medium"
              >
                Limpar busca
              </button>
            )}
          </div>

          {filteredChapters.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-content-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-content-primary mb-2">
                {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum capítulo ainda'}
              </h3>
              <p className="text-content-secondary max-w-md mx-auto">
                {searchQuery 
                  ? 'Tente usar palavras-chave diferentes ou verifique a ortografia.'
                  : 'Os capítulos aparecerão aqui assim que forem publicados.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredChapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;

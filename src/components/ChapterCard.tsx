import { Link } from 'react-router-dom';
import { Clock, BookOpen, Eye } from 'lucide-react';
import type { Chapter } from '@/types/novel';

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
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

  return (
    <article className="chapter-card group">
      <div className="flex flex-col space-y-4">
        {/* Chapter Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="novel-badge">
              {chapter.novelTitle}
            </span>
            <span className="text-sm text-content-tertiary">
              Cap. {chapter.chapterNumber}
            </span>
          </div>
          
          <Link 
            to={`/chapter/${chapter.slug}`}
            className="group"
          >
            <h2 className="text-xl font-semibold text-content-primary group-hover:text-accent transition-colors">
              {chapter.title}
            </h2>
          </Link>
        </div>

        {/* Chapter Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-content-secondary">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(chapter.publishedAt)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{getReadingTime(chapter.wordCount)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{chapter.wordCount} palavras</span>
          </div>
        </div>

        {/* Chapter Preview */}
        <div className="prose prose-sm max-w-none">
          <p className="text-content-secondary line-clamp-3">
            {chapter.content.substring(0, 200).replace(/[#*]/g, '')}...
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-2">
          <Link
            to={`/chapter/${chapter.slug}`}
            className="inline-flex items-center text-accent hover:text-accent-hover font-medium text-sm transition-colors"
          >
            Continuar lendo
            <svg
              className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
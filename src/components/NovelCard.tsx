import { Link } from 'react-router-dom';
import { Calendar, User, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Novel } from '@/types/novel';

interface NovelCardProps {
  novel: Novel;
}

const NovelCard = ({ novel }: NovelCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'ongoing':
        return 'default';
      case 'hiatus':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completa';
      case 'ongoing':
        return 'Em andamento';
      case 'hiatus':
        return 'Hiato';
      default:
        return status;
    }
  };

  return (
    <Link to={`/novel/${novel.slug}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-border-subtle bg-surface">
        <CardHeader className="p-0">
          <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg bg-gradient-to-br from-accent/20 to-accent/5">
            {novel.coverImage ? (
              <img 
                src={novel.coverImage} 
                alt={`Capa de ${novel.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-accent/60" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Badge variant={getStatusVariant(novel.status) as any}>
                {getStatusText(novel.status)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <CardTitle className="text-lg font-bold text-content-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {novel.title}
          </CardTitle>
          
          <CardDescription className="text-content-secondary mb-4 line-clamp-3">
            {novel.description}
          </CardDescription>
          
          <div className="space-y-2 text-sm text-content-tertiary">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{novel.author}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{novel.totalChapters} capítulos</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(novel.createdAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border-subtle">
            <Badge variant="outline" className="text-xs">
              {novel.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NovelCard;
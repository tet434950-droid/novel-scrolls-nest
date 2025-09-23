import { useState, useEffect } from 'react';
import type { Novel, Chapter } from '@/types/novel';

export const useNovels = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        // Primeiro tenta buscar do arquivo JSON existente
        try {
          const response = await fetch('/data/novels.json?' + Date.now());
          if (response.ok) {
            const data = await response.json();
            const transformedNovels = Array.isArray(data) ? data.map((item: any) => ({
              ...item,
              id: item.id || `novel-${Date.now()}`,
              slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              createdAt: new Date(item.createdAt || Date.now()),
              updatedAt: new Date(item.updatedAt || Date.now()),
            })) : data.items?.map((item: any) => ({
              ...item,
              id: item.id || `novel-${Date.now()}`,
              slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              createdAt: new Date(item.createdAt || Date.now()),
              updatedAt: new Date(item.updatedAt || Date.now()),
            })) || [];
            
            setNovels(transformedNovels);
            return;
          }
        } catch (jsonError) {
          console.log('JSON file not found, checking for individual files...');
        }

        // Se não encontrar o JSON, cria dados de exemplo
        const exampleNovels: Novel[] = [
          {
            id: 'novel-1',
            title: 'Exemplo de Novel',
            slug: 'exemplo-de-novel',
            description: 'Uma novel de exemplo para demonstrar o sistema.',
            author: 'Autor Exemplo',
            category: 'Fantasia',
            status: 'ongoing' as const,
            totalChapters: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ];
        
        setNovels(exampleNovels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  return { novels, loading, error };
};

export const useChapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Primeiro tenta buscar do arquivo JSON existente
        try {
          const response = await fetch('/data/chapters.json?' + Date.now());
          if (response.ok) {
            const data = await response.json();
            const transformedChapters = Array.isArray(data) ? data.map((item: any) => ({
              id: item.id || `chapter-${Date.now()}`,
              novelId: item.novelId || 'novel-1',
              novelTitle: item.novelTitle || 'Exemplo de Novel',
              title: item.title,
              slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              chapterNumber: item.chapterNumber || item.number || 1,
              content: item.content || item.body || '',
              publishedAt: new Date(item.publishedAt || item.date || Date.now()),
              wordCount: item.wordCount || item.words || 0,
              isPublished: item.isPublished !== undefined ? item.isPublished : true,
            })) : data.items?.map((item: any) => ({
              id: item.id || `chapter-${Date.now()}`,
              novelId: item.novelId || 'novel-1',
              novelTitle: item.novelTitle || 'Exemplo de Novel',
              title: item.title,
              slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              chapterNumber: item.chapterNumber || item.number || 1,
              content: item.content || item.body || '',
              publishedAt: new Date(item.publishedAt || item.date || Date.now()),
              wordCount: item.wordCount || item.words || 0,
              isPublished: item.isPublished !== undefined ? item.isPublished : true,
            })) || [];
            
            setChapters(transformedChapters);
            return;
          }
        } catch (jsonError) {
          console.log('Chapters JSON file not found, checking for individual files...');
        }

        // Se não encontrar o JSON, cria dados de exemplo
        const exampleChapters: Chapter[] = [
          {
            id: 'chapter-1',
            novelId: 'novel-1',
            novelTitle: 'Exemplo de Novel',
            title: 'Capítulo 1: O Início',
            slug: 'capitulo-1-o-inicio',
            chapterNumber: 1,
            content: 'Este é um capítulo de exemplo para demonstrar o sistema de gerenciamento de capítulos. Aqui você pode escrever todo o conteúdo da sua história...',
            publishedAt: new Date(),
            wordCount: 150,
            isPublished: true,
          }
        ];
        
        setChapters(exampleChapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  return { chapters, loading, error };
};

export const useNovelChapters = (novelId: string) => {
  const { chapters, loading, error } = useChapters();
  const filteredChapters = chapters
    .filter(chapter => chapter.novelId === novelId)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
    
  return { chapters: filteredChapters, loading, error };
};
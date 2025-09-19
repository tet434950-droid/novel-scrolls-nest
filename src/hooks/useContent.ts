import { useState, useEffect } from 'react';
import type { Novel, Chapter } from '@/types/novel';

export const useNovels = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('/data/novels.json?' + Date.now());
        if (!response.ok) throw new Error('Failed to fetch novels');
        const data = await response.json();
        
        const transformedNovels = data.items.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt || Date.now()),
          updatedAt: new Date(item.updatedAt || Date.now()),
        }));
        
        setNovels(transformedNovels);
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
        const response = await fetch('/data/chapters.json?' + Date.now());
        if (!response.ok) throw new Error('Failed to fetch chapters');
        const data = await response.json();
        
        const transformedChapters = data.items.map((item: any) => ({
          id: item.id,
          novelId: item.novelId,
          novelTitle: '', // Will be populated when needed
          title: item.title,
          slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          chapterNumber: item.number,
          content: item.body || '',
          publishedAt: new Date(item.date),
          wordCount: item.words || 0,
          isPublished: true,
        }));
        
        setChapters(transformedChapters);
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
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Novel, Chapter } from '@/types/novel';

export const useNovels = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('novels')
          .select('*')
          .eq('status', 'published')
          .order('updated_at', { ascending: false });

        if (supabaseError) throw supabaseError;

        const transformedNovels: Novel[] = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description || item.synopsis || '',
          coverImage: item.cover_image,
          author: item.author,
          category: item.category,
          genre: item.genre,
          synopsis: item.synopsis,
          tags: item.tags,
          status: item.status === 'published' ? 'ongoing' : 'completed',
          totalChapters: item.total_chapters || 0,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        }));

        setNovels(transformedNovels);
      } catch (err) {
        console.error('Error fetching novels:', err);
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
        const { data, error: supabaseError } = await supabase
          .from('chapters')
          .select('*')
          .eq('status', 'published')
          .eq('is_published', true)
          .or(`publish_at.is.null,publish_at.lte.${new Date().toISOString()}`)
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;

        const transformedChapters: Chapter[] = (data || []).map((item: any) => ({
          id: item.id,
          novelId: item.novel_id,
          novelTitle: item.novel_title,
          title: item.title,
          subtitle: item.subtitle,
          slug: item.slug,
          chapterNumber: item.chapter_number,
          content: item.content,
          publishedAt: new Date(item.publish_at || item.created_at),
          wordCount: item.word_count || 0,
          isPublished: item.is_published,
        }));

        setChapters(transformedChapters);
      } catch (err) {
        console.error('Error fetching chapters:', err);
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
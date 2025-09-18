export interface Novel {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  author: string;
  category: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  totalChapters: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  novelId: string;
  novelTitle: string;
  title: string;
  slug: string;
  chapterNumber: number;
  content: string;
  publishedAt: Date;
  wordCount: number;
  isPublished: boolean;
}

export interface Comment {
  id: string;
  chapterId: string;
  author: string;
  content: string;
  createdAt: Date;
  parentId?: string; // for replies
}

export interface BlogState {
  novels: Novel[];
  chapters: Chapter[];
  comments: Comment[];
}
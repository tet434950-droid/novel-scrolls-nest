-- Create enum for novel status
CREATE TYPE public.novel_status AS ENUM ('draft', 'published');

-- Create enum for chapter status
CREATE TYPE public.chapter_status AS ENUM ('draft', 'published');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create novels table
CREATE TABLE public.novels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  status public.novel_status DEFAULT 'draft',
  total_chapters INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  novel_id UUID NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
  novel_title TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  status public.chapter_status DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(novel_id, chapter_number),
  UNIQUE(novel_id, slug)
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_novels_updated_at
  BEFORE UPDATE ON public.novels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for novels (public read, admin write)
CREATE POLICY "Novels are viewable by everyone for published"
  ON public.novels FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all novels"
  ON public.novels FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert novels"
  ON public.novels FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update novels"
  ON public.novels FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete novels"
  ON public.novels FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for chapters (public read published, admin all)
CREATE POLICY "Published chapters are viewable by everyone"
  ON public.chapters FOR SELECT
  USING (
    status = 'published' 
    AND is_published = TRUE 
    AND (publish_at IS NULL OR publish_at <= NOW())
  );

CREATE POLICY "Admins can view all chapters"
  ON public.chapters FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert chapters"
  ON public.chapters FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update chapters"
  ON public.chapters FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete chapters"
  ON public.chapters FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (admin only)
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles are updatable by owner"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create storage bucket for covers and images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('novel-covers', 'novel-covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('chapter-images', 'chapter-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for novel covers
CREATE POLICY "Novel covers are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'novel-covers');

CREATE POLICY "Admins can upload novel covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'novel-covers' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update novel covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'novel-covers' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete novel covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'novel-covers' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Storage policies for chapter images
CREATE POLICY "Chapter images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chapter-images');

CREATE POLICY "Admins can upload chapter images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'chapter-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update chapter images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'chapter-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete chapter images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'chapter-images' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Create indexes for better performance
CREATE INDEX idx_novels_slug ON public.novels(slug);
CREATE INDEX idx_novels_status ON public.novels(status);
CREATE INDEX idx_chapters_novel_id ON public.chapters(novel_id);
CREATE INDEX idx_chapters_slug ON public.chapters(novel_id, slug);
CREATE INDEX idx_chapters_status ON public.chapters(status);
CREATE INDEX idx_chapters_publish_at ON public.chapters(publish_at);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
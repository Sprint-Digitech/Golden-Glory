-- Create blog_comments table (used by the "Leave a Reply" form on blog detail pages)
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  blog_slug text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  comment text NOT NULL
);

-- Visitors can only submit comments; reading them (emails included) is not public
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a comment" ON public.blog_comments;
CREATE POLICY "Anyone can submit a comment"
  ON public.blog_comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

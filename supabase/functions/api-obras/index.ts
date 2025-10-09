import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(p => p)

    // GET /api/obras - Lista todas as obras publicadas
    if (pathParts.length === 0 || pathParts[pathParts.length - 1] === 'api-obras') {
      const { data, error } = await supabaseClient
        .from('novels')
        .select('*')
        .eq('status', 'published')
        .order('updated_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /api/obras/:slug - Retorna obra + capítulos publicados
    if (pathParts.length === 1) {
      const slug = pathParts[0]

      const { data: novel, error: novelError } = await supabaseClient
        .from('novels')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (novelError) throw novelError

      const { data: chapters, error: chaptersError } = await supabaseClient
        .from('chapters')
        .select('*')
        .eq('novel_id', novel.id)
        .eq('status', 'published')
        .eq('is_published', true)
        .lte('publish_at', new Date().toISOString())
        .order('chapter_number', { ascending: true })

      if (chaptersError) throw chaptersError

      return new Response(
        JSON.stringify({ ...novel, chapters }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /api/obras/:slug/:chapterSlug - Retorna conteúdo do capítulo
    if (pathParts.length === 2) {
      const [novelSlug, chapterSlug] = pathParts

      // Primeiro busca a novel
      const { data: novel, error: novelError } = await supabaseClient
        .from('novels')
        .select('id')
        .eq('slug', novelSlug)
        .eq('status', 'published')
        .single()

      if (novelError) throw novelError

      // Depois busca o capítulo
      const { data: chapter, error: chapterError } = await supabaseClient
        .from('chapters')
        .select('*')
        .eq('slug', chapterSlug)
        .eq('novel_id', novel.id)
        .eq('status', 'published')
        .eq('is_published', true)
        .lte('publish_at', new Date().toISOString())
        .single()

      if (chapterError) throw chapterError

      return new Response(
        JSON.stringify(chapter),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Rota não encontrada' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

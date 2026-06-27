
-- Grant public read access to services, gallery_items, reviews
-- (RLS policies already restrict to is_active/is_published rows)
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;

GRANT ALL ON public.services TO service_role;
GRANT ALL ON public.gallery_items TO service_role;
GRANT ALL ON public.reviews TO service_role;

-- Bookings: anon must INSERT (public form); admin reads via service_role
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;

-- Simple per-IP rate limit for the public booking form
CREATE TABLE IF NOT EXISTS public.booking_rate_limit (
  ip text PRIMARY KEY,
  count integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.booking_rate_limit TO service_role;
ALTER TABLE public.booking_rate_limit ENABLE ROW LEVEL SECURITY;
-- No policies → only service_role bypass can touch it.

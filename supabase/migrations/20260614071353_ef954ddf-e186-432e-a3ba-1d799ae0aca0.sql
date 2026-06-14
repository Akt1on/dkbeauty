
-- Restrict SECURITY DEFINER functions from public role
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

-- Tighten bookings insert with a non-trivial check
DROP POLICY "bookings public insert" ON public.bookings;
CREATE POLICY "bookings public insert" ON public.bookings
  FOR INSERT
  WITH CHECK (
    length(trim(name)) >= 2
    AND length(trim(phone)) >= 10
    AND length(trim(category)) >= 1
  );

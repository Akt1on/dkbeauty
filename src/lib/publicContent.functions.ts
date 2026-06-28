import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type PublicService = {
  id: string; category: string; name: string; price: string; duration: string | null; sort_order: number;
};
export type PublicGalleryItem = {
  id: string; image_url: string; alt: string | null; sort_order: number;
};
export type PublicReview = {
  id: string; author: string; rating: number; text: string; source: string | null; created_at: string;
};

export const listPublicServices = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("services")
    .select("id,category,name,price,duration,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) return [] as PublicService[];
  return (data ?? []) as PublicService[];
});

export const listPublicGallery = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("gallery_items")
    .select("id,image_url,alt,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return [] as PublicGalleryItem[];
  return (data ?? []) as PublicGalleryItem[];
});

export const listPublicReviews = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("reviews")
    .select("id,author,rating,text,source,created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) return [] as PublicReview[];
  return (data ?? []) as PublicReview[];
});

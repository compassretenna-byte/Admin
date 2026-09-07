import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL || 
  'https://placeholder.supabase.co';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SearchResult = {
  entity_type: string;
  entity_id: string;
  title: string;
  snippet: string;
  rank: number;
  data: Record<string, unknown>;
};

export async function globalSearch(
  searchQuery: string,
  resultLimit = 50,
  requestedTenantId?: string
): Promise<SearchResult[]> {
  const query = searchQuery.trim();
  if (!query) {
    return [];
  }
  const params: { search_query: string; result_limit: number; requested_tenant_id?: string } = {
    search_query: query,
    result_limit: resultLimit,
  };
  if (requestedTenantId) {
    params.requested_tenant_id = requestedTenantId;
  }
  const { data, error } = await supabase.rpc("global_search", params);
  if (error) {
    console.error("Global search failed:", error);
    throw error;
  }
  return (data ?? []) as SearchResult[];
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  created_at?: string;
}

export interface LocationItem {
  id: string;
  tenant_id: string;
  name: string;
  type: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  manager?: string;
  status: string;
  station_count: number;
  operating_hours: string;
  is_default: boolean;
  created_at?: string;
}

export async function fetchTenants(): Promise<Tenant[]> {
  const { data, error } = await supabase.from('tenants').select('*').order('name');
  if (error) {
    console.warn('Could not fetch tenants:', error);
    return [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Primary Workspace', slug: 'primary-workspace', active: true }
    ];
  }
  return data || [];
}

export async function createTenant(name: string, slug?: string): Promise<Tenant | null> {
  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { data, error } = await supabase
    .from('tenants')
    .insert([{ name, slug: finalSlug, active: true }])
    .select()
    .single();
  if (error) {
    console.error('Create tenant failed:', error);
    throw error;
  }
  return data;
}

export async function fetchLocations(tenantId?: string): Promise<LocationItem[]> {
  let query = supabase.from('locations').select('*');
  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }
  const { data, error } = await query.order('name');
  if (error) {
    console.warn('Could not fetch locations:', error);
    return [];
  }
  return data || [];
}

export async function createLocation(locationData: Partial<LocationItem>): Promise<LocationItem | null> {
  const { data, error } = await supabase
    .from('locations')
    .insert([locationData])
    .select()
    .single();
  if (error) {
    console.error('Create location failed:', error);
    throw error;
  }
  return data;
}

export async function uploadProductImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Attempt upload to Supabase storage bucket 'product-media' or 'products'
    const { data, error } = await supabase.storage
      .from('product-media')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from('product-media')
        .getPublicUrl(filePath);
      return publicUrlData.publicUrl;
    }
  } catch (err) {
    console.warn('Storage bucket network error, utilizing local preview buffer:', err);
  }

  // Graceful fallback to client DataURL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

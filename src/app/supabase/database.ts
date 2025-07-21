import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Service {
  id: string
  name: string
  name_ar: string
  description: string
  description_ar: string
  category: string
  image_url: string | null
  created_at: string
}

export interface Provider {
  id: string
  service_id: string
  name: string
  name_ar: string
  description: string | null
  description_ar: string | null
  rating: number
  reviews_count: number
  location: string | null
  location_ar: string | null
  phone: string | null
  email: string | null
  image_url: string | null
  price_range: string | null
  price_range_ar: string | null
  availability: boolean
  created_at: string
}

// جلب جميع الخدمات
export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name_ar')

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}

// جلب خدمة محددة
export async function getService(serviceId: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single()

  if (error) {
    console.error('Error fetching service:', error)
    return null
  }

  return data
}

// جلب مقدمي الخدمة لخدمة محددة
export async function getProvidersByService(serviceId: string): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('service_id', serviceId)
    .eq('availability', true)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching providers:', error)
    return []
  }

  return data || []
}

// جلب جميع مقدمي الخدمة
export async function getAllProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('availability', true)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching providers:', error)
    return []
  }

  return data || []
}

// جلب مقدم خدمة محدد
export async function getProvider(providerId: string): Promise<Provider | null> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('id', providerId)
    .single()

  if (error) {
    console.error('Error fetching provider:', error)
    return null
  }

  return data
}

// إضافة مقدم خدمة جديد
export async function addProvider(provider: Omit<Provider, 'id' | 'created_at'>): Promise<Provider | null> {
  const { data, error } = await supabase
    .from('providers')
    .insert(provider)
    .select()
    .single()

  if (error) {
    console.error('Error adding provider:', error)
    return null
  }

  return data
}

// تحديث تقييم مقدم الخدمة
export async function updateProviderRating(providerId: string, rating: number): Promise<boolean> {
  // أولاً جلب البيانات الحالية
  const { data: currentProvider } = await supabase
    .from('providers')
    .select('reviews_count')
    .eq('id', providerId)
    .single()

  if (!currentProvider) return false

  const { error } = await supabase
    .from('providers')
    .update({ 
      rating,
      reviews_count: currentProvider.reviews_count + 1
    })
    .eq('id', providerId)

  if (error) {
    console.error('Error updating provider rating:', error)
    return false
  }

  return true
}

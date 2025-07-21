import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface VectorSearchResult {
  id: string
  content: string
  metadata: Record<string, unknown>
  similarity: number
}

export interface EmbeddingData {
  id: string
  content: string
  embedding: number[]
  metadata: Record<string, unknown>
}

// تحويل النص إلى متجهات باستخدام OpenAI
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    
    return response.data[0].embedding
  } catch (error) {
    console.error('Error creating embedding:', error)
    throw new Error('Failed to create embedding')
  }
}

// البحث في قاعدة البيانات المتجهة
export async function searchVectorDatabase(query: string, limit = 5): Promise<VectorSearchResult[]> {
  try {
    // إنشاء متجه للاستعلام
    const queryEmbedding = await createEmbedding(query)
    
    // البحث في Supabase Vector
    const { data, error } = await supabase.rpc('search_vectors', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit
    })

    if (error) {
      console.error('Error searching vectors:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in vector search:', error)
    return []
  }
}

// حفظ البيانات كمتجهات في Supabase
export async function saveEmbedding(data: EmbeddingData): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('embeddings')
      .insert({
        id: data.id,
        content: data.content,
        embedding: data.embedding,
        metadata: data.metadata
      })

    if (error) {
      console.error('Error saving embedding:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in saveEmbedding:', error)
    return false
  }
}

// تهيئة قاعدة البيانات ببيانات الخدمات
export async function initializeServiceData(): Promise<void> {
  const services = [
    {
      id: 'personal-trainer',
      content: 'مدرب شخصي محترف في أبوظبي يقدم برامج تدريبية مخصصة للياقة البدنية وبناء العضلات وفقدان الوزن',
      metadata: { service: 'personal-trainer', category: 'fitness', location: 'abu-dhabi' }
    },
    {
      id: 'home-cleaning',
      content: 'خدمة تنظيف منازل احترافية في أبوظبي تشمل تنظيف شامل للمنزل والمكاتب بأحدث المعدات والمنظفات الآمنة',
      metadata: { service: 'home-cleaning', category: 'cleaning', location: 'abu-dhabi' }
    },
    {
      id: 'beauty-clinic',
      content: 'عيادة تجميل متطورة في أبوظبي تقدم خدمات العناية بالبشرة والشعر والتجميل الطبي بأحدث التقنيات',
      metadata: { service: 'beauty-clinic', category: 'beauty', location: 'abu-dhabi' }
    },
    {
      id: 'transportation',
      content: 'خدمات النقل والمواصلات في أبوظبي تشمل التاكسي والسائق الخاص والنقل للمطار والرحلات السياحية',
      metadata: { service: 'transportation', category: 'transport', location: 'abu-dhabi' }
    },
    {
      id: 'property-rental',
      content: 'تأجير العقارات في أبوظبي شقق وفلل مفروشة وغير مفروشة للإيجار الشهري والسنوي في أفضل المناطق',
      metadata: { service: 'property-rental', category: 'real-estate', location: 'abu-dhabi' }
    },
    {
      id: 'pet-care',
      content: 'رعاية الحيوانات الأليفة في أبوظبي تشمل الطب البيطري والتدريب والاستحمام والرعاية اليومية',
      metadata: { service: 'pet-care', category: 'pets', location: 'abu-dhabi' }
    },
    {
      id: 'baby-world',
      content: 'خدمات الأطفال في أبوظبي تشمل حضانة الأطفال والمربيات وأنشطة تعليمية وترفيهية للأطفال',
      metadata: { service: 'baby-world', category: 'childcare', location: 'abu-dhabi' }
    }
  ]

  for (const service of services) {
    try {
      const embedding = await createEmbedding(service.content)
      await saveEmbedding({
        id: service.id,
        content: service.content,
        embedding,
        metadata: service.metadata
      })
    } catch (error) {
      console.error(`Error initializing service ${service.id}:`, error)
    }
  }
}

import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export interface ChatResponse {
  content: string;
  source: 'supabase' | 'gpt';
  serviceResults?: any[];
}

export interface ServiceCategory {
  keyword: string;
  category: string;
  searchTerms: string[];
}

class EnhancedChatService {
  private serviceCategories: ServiceCategory[] = [
    {
      keyword: 'مدرب',
      category: 'personal_trainers',
      searchTerms: ['مدرب', 'تدريب', 'رياضة', 'لياقة', 'جيم', 'fitness', 'trainer']
    },
    {
      keyword: 'يخت',
      category: 'yacht_rentals',
      searchTerms: ['يخت', 'قارب', 'بحر', 'رحلة', 'yacht', 'boat', 'cruise']
    },
    {
      keyword: 'شقة',
      category: 'apartments',
      searchTerms: ['شقة', 'سكن', 'إيجار', 'مفروش', 'apartment', 'housing', 'rental']
    },
    {
      keyword: 'تجميل',
      category: 'beauty_clinics',
      searchTerms: ['تجميل', 'عيادة', 'تجميل', 'beauty', 'clinic', 'spa']
    },
    {
      keyword: 'أطفال',
      category: 'kids_services',
      searchTerms: ['أطفال', 'حضانة', 'مربية', 'kids', 'children', 'babysitting']
    },
    {
      keyword: 'تنظيف',
      category: 'housekeeping',
      searchTerms: ['تنظيف', 'تدبير', 'منزل', 'cleaning', 'housekeeping', 'maid']
    }
  ];

  private detectServiceCategory(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    
    for (const category of this.serviceCategories) {
      for (const term of category.searchTerms) {
        if (lowerMessage.includes(term.toLowerCase())) {
          return category.category;
        }
      }
    }
    
    return null;
  }

  private async searchSupabaseServices(category: string, query: string): Promise<any[]> {
    try {
      let supabaseQuery = supabase
        .from('services')
        .select('*')
        .limit(5);

      if (category) {
        supabaseQuery = supabaseQuery.eq('category', category);
      } else {
        // General search across all fields
        supabaseQuery = supabaseQuery.or(
          `name.ilike.%${query}%,description.ilike.%${query}%,provider_name.ilike.%${query}%`
        );
      }

      const { data, error } = await supabaseQuery.order('rating', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error searching Supabase:', error);
      return [];
    }
  }

  private async getGPTResponse(message: string, category: string | null): Promise<string> {
    try {
      const systemPrompt = `أنت مساعد ذكي متخصص في خدمات أبوظبي. اسمك "مساعد AD PLUS". 
      
تجيب باللغة العربية دائماً وتكون مفيداً ومهذباً. 

إذا سُئلت عن خدمة محددة في أبوظبي، قدم معلومات عامة مفيدة ونصائح للعثور على هذه الخدمة.

إذا لم تجد بيانات محددة، اقترح على المستخدم طرق البحث المختلفة أو التواصل المباشر.

كن إيجابياً ومساعداً دائماً.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 
        'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى أو إعادة صياغة السؤال.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى لاحقاً.';
    }
  }

  private generateSupabaseResponse(services: any[], category: string | null): string {
    if (services.length === 0) {
      return 'لم أجد نتائج محددة في قاعدة البيانات. دعني أساعدك بمعلومات عامة.';
    }

    let response = `وجدت ${services.length} خدمة متاحة:\n\n`;
    
    services.forEach((service, index) => {
      response += `${index + 1}. **${service.name}**\n`;
      response += `   المقدم: ${service.provider_name}\n`;
      response += `   الوصف: ${service.description}\n`;
      response += `   السعر: ${service.price} درهم\n`;
      response += `   التقييم: ${service.rating} ⭐\n`;
      if (service.location) response += `   الموقع: ${service.location}\n`;
      response += '\n';
    });

    response += 'هل تريد معلومات إضافية عن أي من هذه الخدمات؟';
    
    return response;
  }

  public async processMessage(message: string): Promise<ChatResponse> {
    try {
      // 1. Detect service category
      const detectedCategory = this.detectServiceCategory(message);
      
      // 2. Search Supabase first
      const supabaseResults = await this.searchSupabaseServices(detectedCategory || '', message);
      
      if (supabaseResults.length > 0) {
        // 3a. If Supabase has data, return structured response
        return {
          content: this.generateSupabaseResponse(supabaseResults, detectedCategory),
          source: 'supabase',
          serviceResults: supabaseResults
        };
      } else {
        // 3b. If no Supabase data, fallback to GPT
        const gptResponse = await this.getGPTResponse(message, detectedCategory);
        return {
          content: gptResponse,
          source: 'gpt',
          serviceResults: []
        };
      }
    } catch (error) {
      console.error('Chat service error:', error);
      
      // Final fallback to GPT
      try {
        const fallbackResponse = await this.getGPTResponse(message, null);
        return {
          content: fallbackResponse,
          source: 'gpt',
          serviceResults: []
        };
      } catch (gptError) {
        return {
          content: 'عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.',
          source: 'gpt',
          serviceResults: []
        };
      }
    }
  }

  public async saveUserRequest(userInput: string, response: ChatResponse): Promise<void> {
    try {
      await supabase
        .from('user_requests')
        .insert({
          user_input: userInput,
          response: response.content,
          source: response.source,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving user request:', error);
      // Don't throw error as this is not critical for user experience
    }
  }
}

// Export singleton instance
export const chatService = new EnhancedChatService();

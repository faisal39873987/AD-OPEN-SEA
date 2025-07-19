import { ServicesAPI } from './servicesAPI';
import { ServiceCategory } from '@/lib/types/database';
import { OpenAI } from 'openai';

// Define the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatResponse {
  content: string;
  serviceResults?: any[];
  source: 'supabase' | 'gpt';
}

// Define service category keywords for detection
const SERVICE_CATEGORIES: Record<ServiceCategory, string[]> = {
  'personal_trainers': ['مدرب', 'مدربة', 'شخصي', 'لياقة', 'تدريب', 'trainer', 'fitness', 'coach', 'personal'],
  'yacht_rentals': ['يخت', 'قارب', 'بحر', 'رحلة بحرية', 'yacht', 'boat', 'sea trip', 'marine'],
  'apartments': ['شقة', 'منزل', 'سكن', 'إيجار', 'apartment', 'housing', 'rent', 'flat'],
  'beauty_clinics': ['تجميل', 'عيادة', 'بشرة', 'جمال', 'beauty', 'clinic', 'skin', 'facial'],
  'kids_services': ['أطفال', 'حضانة', 'روضة', 'kids', 'children', 'childcare', 'nursery'],
  'housekeeping': ['تنظيف', 'منزل', 'خادمة', 'cleaning', 'maid', 'housekeeping', 'cleaner']
};

export class ChatService {
  /**
   * Process a user message and determine if it's a service query
   * If so, fetch results from Supabase; otherwise, use GPT
   */
  static async processMessage(
    userInput: string,
    userId?: string
  ): Promise<ChatResponse> {
    try {
      // Detect if this is a service query and which category
      const detectedCategory = this.detectServiceCategory(userInput);
      
      if (detectedCategory) {
        // This is a service query, search Supabase
        const serviceResults = await ServicesAPI.searchServices(detectedCategory, userInput);
        
        if (serviceResults.length > 0) {
          // Save the user request with Supabase as source
          const responseText = `وجدت ${serviceResults.length} نتائج في فئة ${this.getCategoryName(detectedCategory)}:`;
          await ServicesAPI.saveUserRequest(userInput, responseText, 'supabase', userId);
          
          return {
            content: responseText,
            serviceResults: serviceResults,
            source: 'supabase'
          };
        } else {
          // No services found, fall back to GPT
          return await this.getGPTResponse(userInput, detectedCategory, userId);
        }
      } else {
        // Not a service query, use GPT directly
        return await this.getGPTResponse(userInput, null, userId);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.';
      
      // Still try to save the error encounter
      try {
        await ServicesAPI.saveUserRequest(userInput, errorMessage, 'gpt', userId);
      } catch (saveError) {
        console.error('Error saving error response:', saveError);
      }
      
      return {
        content: errorMessage,
        source: 'gpt'
      };
    }
  }

  /**
   * Detect which service category the user input is related to
   */
  private static detectServiceCategory(userInput: string): ServiceCategory | null {
    const normalizedInput = userInput.toLowerCase();
    
    for (const [category, keywords] of Object.entries(SERVICE_CATEGORIES)) {
      for (const keyword of keywords) {
        if (normalizedInput.includes(keyword.toLowerCase())) {
          return category as ServiceCategory;
        }
      }
    }
    
    return null;
  }

  /**
   * Get human-readable name for service category
   */
  private static getCategoryName(category: ServiceCategory): string {
    const names = {
      'personal_trainers': 'المدربين الشخصيين',
      'yacht_rentals': 'تأجير اليخوت',
      'apartments': 'الشقق السكنية',
      'beauty_clinics': 'عيادات التجميل',
      'kids_services': 'خدمات الأطفال',
      'housekeeping': 'خدمات التدبير المنزلي'
    };
    
    return names[category] || category;
  }

  /**
   * Get response from OpenAI GPT
   */
  private static async getGPTResponse(
    userInput: string,
    category: ServiceCategory | null,
    userId?: string
  ): Promise<ChatResponse> {
    try {
      // Build system prompt based on detected category
      let systemPrompt = 'أنت مساعد AD PLUS Assistant الذي يساعد المستخدمين في العثور على الخدمات في أبوظبي.';
      
      if (category) {
        systemPrompt += ` المستخدم يبحث عن معلومات حول ${this.getCategoryName(category)}. قدم معلومات عامة مفيدة وإرشادات حول هذه الخدمة في أبوظبي.`;
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const responseText = completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من فهم طلبك. هل يمكنك إعادة الصياغة؟';
      
      // Save the user request with GPT as source
      await ServicesAPI.saveUserRequest(userInput, responseText, 'gpt', userId);
      
      return {
        content: responseText,
        source: 'gpt'
      };
    } catch (error) {
      console.error('Error getting GPT response:', error);
      return {
        content: 'عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى لاحقاً.',
        source: 'gpt'
      };
    }
  }

  /**
   * Save user feedback for a service
   */
  static async saveServiceFeedback(
    serviceId: string,
    rating: number,
    feedback?: string,
    userId?: string
  ): Promise<boolean> {
    try {
      const result = await ServicesAPI.saveUserFeedback(
        rating,
        feedback || null,
        serviceId,
        userId
      );
      
      return !!result;
    } catch (error) {
      console.error('Error saving service feedback:', error);
      return false;
    }
  }
}

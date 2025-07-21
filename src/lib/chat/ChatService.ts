import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { ChatMessage, ExtractedData, ServiceProvider, ChatRequest } from './types';
import { detectLanguage } from '../translation';

export class ChatService {
    private supabase;
    private openai;
    private systemPrompt = "You are a helpful assistant that extracts structured data from Arabic and English messages about service providers. For provider registration, extract these details:\n- Name\n- Job (like: maid, driver, etc.)\n- Phone number\n- Nationality\n- Experience\n- Additional details\nFormat responses professionally in the user's original language.";



    constructor(supabaseUrl: string, supabaseKey: string, openaiKey: string) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.openai = new OpenAI({ apiKey: openaiKey });
    }

    async processUserMessage(message: string): Promise<string> {
        try {
            const userLanguage = await detectLanguage(message);
            const extractedData = await this.extractDataFromMessage(message);
            
            if (extractedData.job) {
                // This appears to be a service provider registration
                await this.storeServiceProvider(extractedData);
                const response = await this.generateRegistrationResponse(extractedData, userLanguage);
                return response;
            } else {
                // This appears to be a service request
                const matchingProviders = await this.findMatchingProviders(message);
                const response = await this.generateSearchResponse(matchingProviders, message, userLanguage);
                return response;
            }
        } catch (error) {
            console.error('Error processing message:', error);
            return 'Sorry, there was an error processing your request. Please try again.';
        }
    }

    private async extractDataFromMessage(message: string): Promise<ExtractedData> {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: this.systemPrompt },
                { role: "user", content: `Extract structured data from this message: "${message}"` }
            ],
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0].message.content || "{}");
    }

    private async storeServiceProvider(data: ExtractedData): Promise<void> {
        const { error } = await this.supabase
            .from('service_providers')
            .insert([data]);

        if (error) throw error;
    }

    private async findMatchingProviders(query: string): Promise<ServiceProvider[]> {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Extract search keywords (job, location) from the query." },
                { role: "user", content: query }
            ],
            response_format: { type: "json_object" }
        });

        const searchTerms = JSON.parse(completion.choices[0].message.content || "{}");

        const { data, error } = await this.supabase
            .from('service_providers')
            .select('*')
            .ilike('job', `%${searchTerms.job || ''}%`)
            .limit(5);

        if (error) throw error;
        return data || [];
    }

    private async generateRegistrationResponse(data: ExtractedData, language: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: `Generate a professional confirmation response in ${language}.` },
                { role: "user", content: JSON.stringify(data) }
            ]
        });

        return response.choices[0].message.content || "";
    }

    private async generateSearchResponse(providers: ServiceProvider[], originalQuery: string, language: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { 
                    role: "system", 
                    content: `Generate a helpful response in ${language} listing the matching service providers. Include relevant details like name, experience, and contact information.`
                },
                { 
                    role: "user", 
                    content: `Query: ${originalQuery}\nProviders: ${JSON.stringify(providers)}` 
                }
            ]
        });

        return response.choices[0].message.content || "";
    }

    async processBulkData(text: string): Promise<number> {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { 
                    role: "system", 
                    content: "Extract multiple service provider records from the bulk text. Return an array of records." 
                },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" }
        });

        const extractedRecords = JSON.parse(completion.choices[0].message.content || "[]");
        
        const { data, error } = await this.supabase
            .from('service_providers')
            .insert(extractedRecords);

        if (error) throw error;
        return extractedRecords.length;
    }

    async verifyDatabaseStructure(): Promise<{ success: boolean, tables: any }> {
        try {
            const providersResult = await this.supabase
                .from('service_providers')
                .select('*')
                .limit(1);

            const requestsResult = await this.supabase
                .from('chat_requests')
                .select('*')
                .limit(1);

            if (providersResult.error) throw providersResult.error;
            if (requestsResult.error) throw requestsResult.error;

            return {
                success: true,
                tables: {
                    service_providers: providersResult.data,
                    chat_requests: requestsResult.data
                }
            };
        } catch (error) {
            console.error('Database verification failed:', error);
            return {
                success: false,
                tables: { error }
            };
        }
    }
}

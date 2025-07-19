export interface ServiceProvider {
    id: string;
    name: string;
    job: string;
    phone?: string;
    nationality?: string;
    experience?: string;
    details?: string;
    created_at?: string;
}

export interface ChatRequest {
    id: string;
    user_question: string;
    ai_response?: string;
    requested_at?: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ExtractedData {
    name?: string;
    job?: string;
    phone?: string;
    nationality?: string;
    experience?: string;
    details?: string;
}

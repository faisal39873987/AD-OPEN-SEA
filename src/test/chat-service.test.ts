import { ChatService } from '../lib/chat/ChatService.ts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const chatService = new ChatService(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    process.env.OPENAI_API_KEY!
);

async function runTests() {
    console.log('1. Verifying database structure...');
    const dbStructure = await chatService.verifyDatabaseStructure();
    console.log('Database verification result:', JSON.stringify(dbStructure, null, 2));

    console.log('\n2. Testing service provider registration...');
    const registrationResponse = await chatService.processUserMessage(
        'My name is Ahmed, I\'m from Egypt, a personal trainer with 5 years of experience. My phone number is 0521234567.'
    );
    console.log('Registration response:', registrationResponse);

    console.log('\n3. Testing service provider search...');
    const searchResponse = await chatService.processUserMessage(
        'I need a personal trainer in Abu Dhabi.'
    );
    console.log('Search response:', searchResponse);
}

runTests().catch(console.error);

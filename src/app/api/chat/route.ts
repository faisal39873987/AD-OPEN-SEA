import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate smart response based on user input
    const smartResponse = generateSmartResponse(message);
    return NextResponse.json({ message: smartResponse });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateSmartResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Service categories mapping
  const serviceResponses: { [key: string]: string } = {
    'plumber': 'I know several excellent plumbers in Abu Dhabi! I can help you find a reliable and experienced plumber. Do you need an emergency service or regular maintenance?',
    'electrician': 'We have licensed and reliable electricians in Abu Dhabi. Do you need electrical repairs or a new installation?',
    'carpenter': 'I can recommend skilled carpenters for woodworking and furniture in Abu Dhabi. What type of work do you need?',
    'ac': 'Air conditioning maintenance and repair services are available 24/7 in Abu Dhabi. Do you need maintenance or repairs?',
    'cleaning': 'Residential and commercial cleaning services are available at competitive prices. Do you want daily or weekly cleaning?',
    'painter': 'Professional painters for homes and offices with high quality. What area needs painting?',
    'construction': 'Contractors and engineers for construction projects. Is the project residential or commercial?',
    'gardening': 'Landscaping and gardening experts in Abu Dhabi. Do you want a new garden design or maintenance?',
    'kitchen': 'Kitchen design and installation experts. Do you want a new kitchen or a renovation?'
  };
  
  // Check for service keywords
  for (const [keyword, response] of Object.entries(serviceResponses)) {
    if (message.includes(keyword)) {
      return response;
    }
  }
  
  // Generic helpful responses
  if (message.includes('price') || message.includes('cost') || message.includes('fee')) {
    return 'Service prices vary depending on the type of service and location. I can help you get quotes from several service providers for comparison. What service are you looking for?';
  }
  
  if (message.includes('emergency') || message.includes('urgent')) {
    return 'Emergency services are available 24/7 in Abu Dhabi! I will help you find the nearest service provider available immediately. What type of emergency is it?';
  }
  
  if (message.includes('area') || message.includes('location')) {
    return 'I can find service providers in all areas of Abu Dhabi: Al Karama, Al Khalidiyah, Al Muroor, Hamdan Street, Yas Island, and more. In which area do you need service?';
  }
  
  // Default intelligent response
  return `Hello! I'm your smart assistant at AD Pulse. I understand you're looking for "${userMessage}". 

I can help you with:
🔧 Finding the best service providers
💰 Comparing prices and offers  
⭐ Reading ratings and reviews
📍 Finding services near your location
⚡ Emergency services available 24/7

What specific service do you need?`;
}

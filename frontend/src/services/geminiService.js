// Google Gemini AI Service for Real Script Generation
export class GeminiService {
  
  static async generateScript(data) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not configured');
      }

      const { topic, platform, style, length, domain, trendingKeywords } = data;
      
      // Create context-aware prompt based on platform and style
      const prompt = this.createPrompt(topic, platform, style, length, domain, trendingKeywords);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No content generated from Gemini API');
      }

      return this.formatScript(generatedText, platform);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  static createPrompt(topic, platform, style, length, domain, trendingKeywords = []) {
    const platformInstructions = {
      youtube: {
        casual: "Create a casual, conversational YouTube script that feels like talking to a friend. Use 'you' and 'I', include engaging questions, and add calls-to-action like 'like and subscribe'.",
        professional: "Create a professional, educational YouTube script with clear structure, expert insights, and valuable takeaways. Use formal language and include data-driven points.",
        energetic: "Create a high-energy, exciting YouTube script with enthusiasm, exclamation points, and engaging hooks. Use trending slang and create FOMO (fear of missing out)."
      },
      instagram: {
        casual: "Create a casual Instagram post with emojis, personal stories, and engaging questions. Use hashtags naturally and keep it under 2200 characters.",
        professional: "Create a professional Instagram post with industry insights, clean formatting, and valuable expertise. Use professional hashtags and maintain brand voice.",
        energetic: "Create an energetic Instagram post with excitement, emojis, and viral potential. Use trending hashtags and create engagement through questions."
      },
      twitter: {
        casual: "Create a casual tweet with conversational tone, personal opinions, and engaging questions. Keep under 280 characters with relevant hashtags.",
        professional: "Create a professional tweet with industry insights, data points, and expert commentary. Use professional hashtags and maintain credibility.",
        energetic: "Create an energetic tweet with excitement, trending topics, and viral potential. Use emojis and create engagement through bold statements."
      }
    };

    const lengthInstructions = {
      short: "Keep the content concise and impactful (under 100 words for posts, under 200 words for scripts).",
      medium: "Create moderate-length content (100-300 words for posts, 300-600 words for scripts).",
      long: "Create comprehensive, detailed content (300+ words for posts, 600+ words for scripts)."
    };

    const domainContext = domain ? `
Domain Context: The user specializes in ${domain}. Tailor the content to this niche with relevant terminology and audience understanding.
` : '';

    const keywordsContext = trendingKeywords.length > 0 ? `
Trending Keywords: Naturally incorporate these trending keywords: ${trendingKeywords.join(', ')}.
` : '';

    const prompt = `
You are an expert content creator and social media strategist. Generate engaging content based on the following requirements:

TOPIC: ${topic}
PLATFORM: ${platform.toUpperCase()}
STYLE: ${style.toUpperCase()}
LENGTH: ${length.toUpperCase()}

${domainContext}
${keywordsContext}

PLATFORM-SPECIFIC INSTRUCTIONS:
${platformInstructions[platform]?.[style] || platformInstructions.youtube.casual}

LENGTH REQUIREMENTS:
${lengthInstructions[length]}

ADDITIONAL REQUIREMENTS:
- Make the content authentic and engaging
- Include relevant hashtags for social media platforms
- Add natural call-to-actions where appropriate
- Ensure the content is platform-optimized
- Use current trending topics and cultural references when relevant
- Make it shareable and engaging

Generate the content now:
`;

    return prompt;
  }

  static formatScript(generatedText, platform) {
    // Clean up and format the generated text
    let formatted = generatedText.trim();
    
    // Remove any markdown formatting
    formatted = formatted.replace(/\*\*/g, '');
    formatted = formatted.replace(/\*/g, '');
    
    // Remove excessive newlines
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Platform-specific formatting
    switch (platform) {
      case 'instagram':
        // Ensure hashtags are properly formatted
        formatted = formatted.replace(/#(\w+)/g, '#$1');
        // Add line breaks for readability
        formatted = formatted.replace(/([.!?])\s+/g, '$1\n\n');
        break;
        
      case 'twitter':
        // Ensure it's under 280 characters
        if (formatted.length > 280) {
          formatted = formatted.substring(0, 277) + '...';
        }
        break;
        
      case 'youtube':
        // Add timestamps for longer scripts
        if (formatted.length > 500) {
          const sections = formatted.split('\n\n');
          formatted = sections.map((section, index) => {
            if (index === 0) return section;
            return `[${index * 30}:00] ${section}`;
          }).join('\n\n');
        }
        break;
    }
    
    return formatted;
  }

  static async generateMultipleScripts(data, count = 3) {
    try {
      const scripts = [];
      for (let i = 0; i < count; i++) {
        const script = await this.generateScript(data);
        scripts.push(script);
      }
      return scripts;
    } catch (error) {
      console.error('Error generating multiple scripts:', error);
      throw error;
    }
  }

  static async analyzeScript(script, platform) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = `
Analyze this ${platform} script for engagement potential and provide insights:

SCRIPT:
${script}

Provide analysis on:
1. Engagement potential (1-10 scale)
2. Viral potential (1-10 scale)
3. Strengths
4. Areas for improvement
5. Suggested hashtags
6. Best posting time
7. Target audience

Format as JSON response.
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      const analysis = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return analysis;
    } catch (error) {
      console.error('Script analysis error:', error);
      return null;
    }
  }
}

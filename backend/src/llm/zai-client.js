import axios from 'axios';

/**
 * Z.AI LLM Client for code generation
 * Используется для генерации кода приложений на основе промптов
 */
export class ZAIClient {
  constructor() {
    this.apiKey = process.env.ZAI_API_KEY;
    this.baseURL = process.env.ZAI_BASE_URL || 'https://api.z.ai/api/coding/paas/v4';
    this.model = process.env.ZAI_MODEL || 'glm-4.6';

    if (!this.apiKey) {
      console.warn('⚠️ ZAI_API_KEY not set, will use fallback templates');
      this.enabled = false;
    } else {
      this.enabled = true;
      this.client = axios.create({
        baseURL: this.baseURL,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000 // 8 секунд для швидкої генерації
      });
    }
  }

  /**
   * Генерирует код Next.js приложения на основе промпта
   */
  async generateProjectCode(prompt, businessName = 'MyApp') {
    if (!this.enabled) {
      throw new Error('ZAI client not enabled - API key missing');
    }

    const systemPrompt = `You are an expert Next.js developer. Generate a complete, production-ready Next.js application.

CRITICAL: Carefully read the user's description and implement EXACTLY what they ask for.
- If they mention specific features, include ALL of them
- If they describe a style, match it precisely  
- If they name sections, create those exact sections
- Be creative and unique for each request
- No two projects should look the same

REQUIREMENTS:
1. Generate a single page.js file for Next.js 14+ App Router
2. Use modern React with hooks (functional components only)
3. Include inline styles (CSS-in-JS) - NO external CSS files
4. Make it fully responsive and mobile-friendly
5. Add interactive elements and animations
6. Use modern design: unique color schemes, gradients, shadows
7. Include ALL sections and features from the description
8. Make it production-ready with proper UX

OUTPUT FORMAT:
Return ONLY valid JavaScript code for page.js file.
NO markdown, NO explanations, NO comments outside code.
Start directly with: export default function

STYLE VARIETY:
- Vary color schemes based on project type (tech = blue/purple, restaurant = warm colors, portfolio = elegant dark, etc)
- Change layouts: some hero-centered, some side-by-side, some grid-based
- Different typography styles for different projects
- Unique button styles, card designs, spacing
- Creative hover effects and transitions
- Match the vibe: modern/minimalist OR playful/colorful OR professional/corporate`;

    const userPrompt = `Create a unique Next.js application for:

"${prompt}"

Business/Project Name: "${businessName}"

IMPORTANT INSTRUCTIONS:
1. Read the description carefully - implement EXACTLY what's described
2. If specific features are mentioned (contact form, gallery, pricing, testimonials, etc) - include them ALL
3. Make the design match the project type and description
4. Be creative - make this project look DIFFERENT from others
5. Include interactive elements relevant to the description
6. Add proper content that makes sense for this specific project
7. Make it visually stunning and production-ready

Generate the complete application code now:`;

    try {
      console.log('[LLM] Generating code with Z.AI...');
      console.log('[LLM] Prompt:', prompt);
      
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8, // Збільшено для більшої креативності
        max_tokens: 4000,
        stream: false
      });

      const generatedCode = response.data.choices[0].message.content;
      
      // Очистка от markdown форматирования если есть
      let cleanCode = generatedCode.trim();
      if (cleanCode.startsWith('```')) {
        cleanCode = cleanCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
      }
      
      console.log('[LLM] ✅ Code generated successfully');
      console.log('[LLM] Code length:', cleanCode.length, 'characters');
      return cleanCode;
      
    } catch (error) {
      console.error('[LLM] ❌ Generation failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Проверяет доступность API
   */
  async healthCheck() {
    if (!this.enabled) {
      return { status: 'disabled', reason: 'No API key' };
    }

    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10
      });
      
      return { 
        status: 'ok', 
        model: this.model,
        baseURL: this.baseURL 
      };
    } catch (error) {
      return { 
        status: 'error', 
        error: error.message 
      };
    }
  }
}

// Singleton instance
let clientInstance = null;

export function getZAIClient() {
  if (!clientInstance) {
    clientInstance = new ZAIClient();
  }
  return clientInstance;
}

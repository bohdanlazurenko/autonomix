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
        timeout: 120000 // 2 минуты для генерации кода
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

    const systemPrompt = `You are an expert Next.js developer. Generate a complete, production-ready Next.js application based on the user's description.

REQUIREMENTS:
1. Generate a single page.js file for Next.js 14+ App Router
2. Use modern React with hooks (functional components only)
3. Include inline styles (CSS-in-JS) - NO external CSS files
4. Make it fully responsive and mobile-friendly
5. Add interactive elements where appropriate
6. Use modern design: gradients, shadows, smooth animations
7. Include all necessary sections based on the description
8. Make it production-ready with proper error handling

OUTPUT FORMAT:
Return ONLY valid JavaScript code for page.js file.
NO markdown, NO explanations, NO comments outside the code.
Start directly with: export default function Page() {

STYLE GUIDELINES:
- Use inline styles object for all styling
- Include hover effects and transitions
- Make buttons interactive with proper states
- Use CSS Grid or Flexbox for layouts
- Add proper spacing and typography
- Use modern color schemes and gradients`;

    const userPrompt = `Generate a Next.js application for: "${prompt}"

Business name: "${businessName}"

Generate a complete, styled, interactive single-page application.
Include ALL sections mentioned in the description.
Make it visually appealing and production-ready.`;

    try {
      console.log('[LLM] Generating code with Z.AI...');
      
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000, // Больше токенов для полного кода
      });

      const generatedCode = response.data.choices[0].message.content;
      
      // Очистка от markdown форматирования если есть
      let cleanCode = generatedCode.trim();
      if (cleanCode.startsWith('```')) {
        cleanCode = cleanCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
      }
      
      console.log('[LLM] ✅ Code generated successfully');
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

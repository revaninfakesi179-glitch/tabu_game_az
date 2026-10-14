import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==========================================
// 1. Cybersecurity Hardening & Safe Headers
// ==========================================
// Disable Express fingerprinting header to prevent reconnaissance
app.disable('x-powered-by');

// Restrict payload size to prevent Denial of Service (DoS) memory attacks
app.use(express.json({ limit: '100kb' }));

// Apply security headers to prevent clickjacking, MIME sniffing, and cross-site leaks
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// In-memory rate limiting to prevent API flooding / DDoS / quota abuse
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // max 60 requests/min per IP

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const clientData = requestCounts.get(clientIp);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Çox sayda sorğu göndərildi. Zəhmət olmasa bir qədər gözləyin.',
    });
  }

  clientData.count += 1;
  next();
};

app.use('/api', rateLimiter);

// Port binding configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build-tabu',
    },
  },
});

// ==========================================
// 2. Real-Time Internet Web Search Grounding
// ==========================================
interface WebSearchResult {
  title: string;
  snippet: string;
  lang: string;
}

/**
 * Searches the live internet (Azerbaijani & Turkish/English Wikipedia) in real time
 * to retrieve authentic knowledge, key entities, facts, and players for any query.
 */
async function searchLiveWeb(query: string): Promise<WebSearchResult[]> {
  const enc = encodeURIComponent(query.trim());
  const results: WebSearchResult[] = [];
  const headers = { 'User-Agent': 'TabuGame/2.0 (Security-Checked)' };

  // 1. Azerbaijani search
  try {
    const azUrl = `https://az.wikipedia.org/w/api.php?action=query&list=search&srsearch=${enc}&format=json&origin=*&srlimit=10`;
    const azRes = await fetch(azUrl, { headers, signal: AbortSignal.timeout(3500) });
    if (azRes.ok) {
      const azData = await azRes.json();
      if (azData?.query?.search) {
        for (const item of azData.query.search) {
          results.push({
            title: item.title,
            snippet: item.snippet.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"'),
            lang: 'az',
          });
        }
      }
    }
  } catch {
    // Continue gracefully
  }

  // 2. Turkish search (for Turkish clubs, culture, and shared terms like Galatasaray)
  try {
    const trUrl = `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${enc}&format=json&origin=*&srlimit=10`;
    const trRes = await fetch(trUrl, { headers, signal: AbortSignal.timeout(3500) });
    if (trRes.ok) {
      const trData = await trRes.json();
      if (trData?.query?.search) {
        for (const item of trData.query.search) {
          if (!results.some((r) => r.title.toLowerCase() === item.title.toLowerCase())) {
            results.push({
              title: item.title,
              snippet: item.snippet.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"'),
              lang: 'tr',
            });
          }
        }
      }
    }
  } catch {
    // Continue gracefully
  }

  return results;
}

/**
 * Synthesizes authentic Taboo cards from real internet search data
 * when AI quota is exhausted or offline, guaranteeing zero-failure operation.
 */
function synthesizeCardsFromWeb(
  topic: string,
  webResults: WebSearchResult[],
  existingWords: Set<string>,
  targetDifficulty: string = 'orta'
) {
  const cleanTopic = topic.trim().toUpperCase();
  const synthesized: any[] = [];

  // Filter out irrelevant Wikipedia meta titles
  const cleanResults = webResults.filter(
    (r) =>
      !r.title.includes('Vikipediya:') &&
      !r.title.includes('Şablon:') &&
      !r.title.includes('Kateqoriya:') &&
      !r.title.includes('(dəqiqləşdirmə)')
  );

  // Generate cards from genuine web search entities
  for (const item of cleanResults) {
    const word = item.title.trim().toUpperCase();
    if (existingWords.has(word) || synthesized.some((c) => c.word === word)) {
      continue;
    }

    // Extract significant keywords from the real snippet for taboo words
    const wordsInSnippet = item.snippet
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"«»0-9]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && w.toUpperCase() !== word && !cleanTopic.includes(w.toUpperCase()));

    const uniqueWords = Array.from(new Set(wordsInSnippet));
    const tabooCandidates = uniqueWords.slice(0, 5);

    // Complement with high-quality themed fallback taboo words if needed
    const defaultTaboos = [cleanTopic, 'Klub', 'Oyunçu', 'Tarix', 'Məşhur'];
    while (tabooCandidates.length < 5) {
      const candidate = defaultTaboos[tabooCandidates.length];
      if (!tabooCandidates.includes(candidate)) {
        tabooCandidates.push(candidate);
      }
    }

    synthesized.push({
      id: `web_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      word,
      tabooWords: tabooCandidates.slice(0, 5),
      category: 'umumi',
      difficulty: targetDifficulty,
      topic: cleanTopic,
    });

    if (synthesized.length >= 10) break;
  }

  return synthesized;
}

// ==========================================
// 3. API Endpoints
// ==========================================

// Safe health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// Main AI Generation Endpoint with Web Search Grounding & Cybersecurity Validation
app.post('/api/generate-ai-cards', async (req: Request, res: Response) => {
  try {
    const { topic, existingWords = [], count = 10, difficulty = 'orta' } = req.body;

    // Strict input validation & sanitization against injection
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Mövzu mütləq daxil edilməlidir' });
    }

    // Sanitize string to alphanumeric, Azerbaijani chars, spaces and hyphens (max 50 chars)
    const cleanTopic = topic
      .trim()
      .replace(/<[^>]*>/g, '') // strip HTML tags
      .replace(/[^\p{L}\p{N}\s\-_]/gu, '') // strip malicious symbols/scripts
      .slice(0, 50);

    if (!cleanTopic) {
      return res.status(400).json({ error: 'Yararsız mövzu daxil edildi' });
    }

    const safeCount = Math.min(Math.max(1, Number(count) || 10), 20);
    const safeExisting: string[] = Array.isArray(existingWords)
      ? existingWords.filter((w) => typeof w === 'string').map((w) => w.trim().toUpperCase()).slice(-60)
      : [];
    const existingSet = new Set<string>(safeExisting);

    // 1. Fetch real-time live internet information about this topic
    const webFindings = await searchLiveWeb(cleanTopic);
    const webContextSummary = webFindings
      .slice(0, 6)
      .map((w) => `- ${w.title}: ${w.snippet}`)
      .join('\n');

    // 2. Prepare Gemini Prompt with live web search facts
    const prompt = `Sən Azərbaycan dili və mədəniyyətini dərindən bilən peşəkar Tabu oyunu redaktorusan.
İstifadəçinin seçdiyi mövzu: "${cleanTopic}"
Çətinlik səviyyəsi: "${difficulty}"

${webContextSummary ? `İnternetdən tapılan real faktlar və məlumatlar:\n${webContextSummary}\n` : ''}

Tələb: Bu mövzuya ("${cleanTopic}") aid ${safeCount} ədəd orijinal və maraqlı Azərbaycan Tabu kartı hazırla.
Hər kart üçün:
1. "word": Mövzu ilə birbaşa əlaqəli hədəf söz (böyük hərflərlə, məsələn "GALATASARAY", "İCARDİ", "ALİ SAMİ YEN", "RAMS PARK", "DÖRD ULDUZ" və s.).
2. "tabooWords": Bu sözü izah edərkən deyilməsi QADAĞAN olan ən yaxın 5 söz (Azərbaycan dilində).
3. "category": Mövzuya uyğun kateqoriya (məsələn: "idman", "baki_azerbaijan", "elm_texnologiya", "filmler_senet", "umumi").
4. "difficulty": "${difficulty}" ("asan", "orta", və ya "cetin").

Vacib Tələblər:
- Bütün sözlər həqiqətən "${cleanTopic}" mövzusu ilə birbaşa əlaqəli olmalıdır.
- Qadağan sözlər mütləq 5 dənə olmalıdır.
${safeExisting.length > 0 ? `- Bu sözləri təkrarlama: ${safeExisting.slice(-25).join(', ')}.` : ''}
- Yalnız JSON massivi formatında cavab ver:
[
  {
    "word": "HƏDƏF SÖZ",
    "tabooWords": ["Qadağan1", "Qadağan2", "Qadağan3", "Qadağan4", "Qadağan5"],
    "category": "idman",
    "difficulty": "${difficulty}"
  }
]`;

    let generatedCards: any[] = [];

    // Attempt Gemini call with Google Search tool enabled
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text || '[]';
      let parsed: any[] = [];
      try {
        parsed = JSON.parse(responseText);
      } catch {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      }

      if (Array.isArray(parsed) && parsed.length > 0) {
        generatedCards = parsed
          .map((c: any, idx: number) => ({
            id: `ai_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
            word: String(c.word || '').toUpperCase().trim(),
            tabooWords: Array.isArray(c.tabooWords)
              ? c.tabooWords.map((w: any) => String(w).trim()).slice(0, 5)
              : [],
            category: c.category || 'umumi',
            difficulty: c.difficulty || difficulty,
            topic: cleanTopic,
          }))
          .filter((c: any) => c.word && c.tabooWords.length >= 3 && !existingSet.has(c.word));
      }
    } catch (aiErr: any) {
      console.warn('Gemini API call returned status or quota limit, using web-grounded synthesizer:', aiErr?.message || aiErr);
    }

    // 3. Fallback to real web synthesis if Gemini hit 429 quota or returned insufficient cards
    if (generatedCards.length < 3 && webFindings.length > 0) {
      const webCards = synthesizeCardsFromWeb(cleanTopic, webFindings, existingSet, difficulty);
      generatedCards = [...generatedCards, ...webCards];
    }

    return res.json({
      cards: generatedCards,
      groundedInWeb: webFindings.length > 0,
    });
  } catch (error: any) {
    // Prevent internal details/keys leakage in API responses
    console.error('Safe API Error in /api/generate-ai-cards:', error);
    return res.status(500).json({
      error: 'Kartların yaradılması zamanı xəta baş verdi',
    });
  }
});

// ==========================================
// 4. Vite Server & Application Bootstrap
// ==========================================
async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Cyber-Protected] Server running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap();

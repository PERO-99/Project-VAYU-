import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'model'
  text: string
}

const SUGGESTED_PROMPTS = [
  'What are the biggest threats to coral reef ecosystems today?',
  'How do mangrove forests protect coastal communities?',
  'Explain the water cycle and its role in climate regulation.',
  'What is rewilding and why does it matter?',
  'How does soil health connect to food security?',
]

const MOCK_ANSWERS: Record<string, string> = {
  'what are the biggest threats to coral reef ecosystems today?': `### Threats to Coral Reefs

Coral reefs face unprecedented pressure globally. The primary drivers of reef degradation include:

1. **Ocean Acidification**: Increased CO2 absorption lowers ocean pH, making it difficult for corals to build calcium carbonate skeletons.
2. **Rising Sea Temperatures**: Even a 1°C rise can trigger mass bleaching, where corals expel their symbiotic zooxanthellae algae, leading to starvation.
3. **Overfishing & Destructive Practices**: Removing key herbivorous fish allows algae to smother reefs, while blast fishing physically destroys centuries-old structures.
4. **Land-Based Pollution**: Agricultural runoff dumps nitrogen and sediment onto reefs, causing algae blooms and blocking sunlight.

*Preserving these marine nurseries is crucial, as they support 25% of all ocean life despite covering less than 0.1% of the seafloor.*`,

  'how do mangrove forests protect coastal communities?': `### Mangrove Forests: Nature's Coastal Shields

Mangrove ecosystems serve as vital defensive barriers for tropical coasts:

- **Storm Surge Attenuation**: Their complex, dense root systems absorb wave energy, reducing surge heights by up to 66% over 100 meters of forest.
- **Erosion Control**: The roots bind and stabilize sediment, preventing shorelines from washing away into the ocean.
- **Carbon Capture**: Mangroves store up to **4x more carbon** per acre than terrestrial rainforests, directly mitigating global warming.
- **Wildlife Habitats**: They act as critical nurseries for juvenile fish and birds, securing local food chains and coastal economies.

*Restoring degraded mangrove zones is one of the most cost-effective strategies for climate adaptation.*`,

  'explain the water cycle and its role in climate regulation.': `### The Hydrological Cycle & Climate Regulation

The water cycle acts as Earth's temperature regulator:

1. **Evaporative Cooling**: Water evaporating from oceans and forests absorbs latent heat, cooling the surface.
2. **Heat Distribution**: Atmospheric circulation carries moisture towards cooler latitudes. When condensation occurs, it releases this stored heat, balancing global temperatures.
3. **Cloud Albedo**: Clouds reflect incoming solar radiation back into space, shading the planet.
4. **Soil-Vegetation Feedback**: Dynamic soil moisture levels determine local humidity, rainfall, and drought resilience.

*Deforestation and climate warming disrupt this cycle, intensifying droughts and storms in an unpredictable feedback loop.*`,

  'what is rewilding and why does it matter?': `### Rewilding: Restoring Ecological Integrity

Rewilding is a conservation philosophy focused on restoring natural ecosystems to a state where they can sustain themselves without human intervention:

- **Apex Predators**: Reintroducing keystone species (like wolves in Yellowstone) controls prey populations and restores trophic cascades.
- **Connectivity**: Creating wildlife corridors allows species to migrate freely and adapt to shifting temperature zones.
- **Biodiversity Recovery**: Allowing forests and wetlands to regenerate naturally increases resilience against pest outbreaks and fire.

*By stepping back, we allow ecosystem services to recover, providing cleaner water, carbon sequestration, and stable habitats naturally.*`,

  'how does soil health connect to food security?': `### Soil Health & Food Security

Healthy soil is a living ecosystem, not just dirt. It directly affects agricultural resilience:

- **Microbiome Richness**: A spoonful of healthy soil contains billions of microbes that unlock essential nutrients for crops.
- **Water Retention**: Organic-rich soils absorb water like sponges, reducing crop stress during droughts and preventing runoff during heavy rains.
- **Nutrient Density**: Degraded soils produce food with lower mineral and vitamin levels, contributing to hidden hunger.
- **Carbon Sink**: Restoring soil organic matter pulls gigatons of CO2 out of the atmosphere.

*Global agricultural practices have degraded roughly 33% of our topsoil. Rebuilding soil health is essential to feed a growing population.*`
};

function getFallbackAnswer(query: string): string {
  const q = query.toLowerCase().trim();
  for (const [key, answer] of Object.entries(MOCK_ANSWERS)) {
    if (q.includes(key) || key.includes(q)) {
      return answer;
    }
  }

  return `### Climate & Carbon Awareness

While the Google Gemini API key is currently resolving quota limits on the free tier, VAYU's internal environmental archive can share this context:

- **Global Carbon Sinks**: Did you know that protecting old-growth forests and seagrass meadows captures up to 10 times more carbon than planting new saplings?
- **Soil Restoration**: Switching to regenerative farming practices could sequester over 10% of global carbon emissions back into topsoil.
- **Daily Footprint**: Simple lifestyle shifts—like drying clothes naturally and sourcing seasonal foods—drastically reduce personal daily emissions.

*Vayu AI is currently running in offline demonstration mode. Link a billed Google API key to restore dynamic generation.*`;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

async function sendToGemini(history: Message[], userText: string, onFallback: () => void): Promise<string> {
  if (!GEMINI_API_KEY) {
    onFallback()
    await new Promise(r => setTimeout(r, 800))
    return getFallbackAnswer(userText)
  }

  const isGroq = GEMINI_API_KEY.startsWith('gsk_')

  if (isGroq) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are Vayu AI — VAYU's intelligent environmental assistant. VAYU stands for "Carbon Footprint Awareness Platform" with the tagline "Balance Your Breath. Balance the Atmosphere."
You help users understand ecosystems, carbon footprints, climate science, conservation, and environmental storytelling.
Speak with calm authority, use evocative language, and cite scientific facts when relevant.
Keep responses concise but substantive (150–300 words). Use markdown for structure when helpful.`
        },
        ...history.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        })),
        { role: 'user', content: userText }
      ]

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: 0.7
        })
      })

      if (!res.ok) {
        onFallback()
        await new Promise(r => setTimeout(r, 900))
        return getFallbackAnswer(userText)
      }

      const data = await res.json()
      return data.choices?.[0]?.message?.content || 'No response received.'
    } catch (e) {
      onFallback()
      await new Promise(r => setTimeout(r, 900))
      return getFallbackAnswer(userText)
    }
  }

  const contents = [
    ...history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: userText }] },
  ]

  const systemInstruction = {
    parts: [{
      text: `You are Vayu AI — VAYU's intelligent environmental assistant. VAYU stands for "Carbon Footprint Awareness Platform" with the tagline "Balance Your Breath. Balance the Atmosphere."
You help users understand ecosystems, carbon footprints, climate science, conservation, and environmental storytelling.
Speak with calm authority, use evocative language, and cite scientific facts when relevant.
Keep responses concise but substantive (150–300 words). Use markdown for structure when helpful.`,
    }],
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, systemInstruction }),
      }
    )

    if (!res.ok) {
      onFallback()
      await new Promise(r => setTimeout(r, 900))
      return getFallbackAnswer(userText)
    }

    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.'
  } catch (error) {
    onFallback()
    await new Promise(r => setTimeout(r, 900))
    return getFallbackAnswer(userText)
  }
}

function MarkdownText({ text }: { text: string }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.1em;font-weight:500;margin:0.8em 0 0.3em">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.25em;font-weight:500;margin:1em 0 0.4em">$1</h2>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:1.2em;list-style:disc">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:0.6em 0">')
    .replace(/\n/g, '<br/>')

  return <div dangerouslySetInnerHTML={{ __html: `<p style="margin:0">${html}</p>` }} />
}

export default function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setError(null)

    const userMsg: Message = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const reply = await sendToGemini(messages, text.trim(), () => setIsDemoMode(true))
      setMessages(prev => [...prev, { role: 'model', text: reply }])
    } catch (e: any) {
      let friendlyMessage = e.message || 'Something went wrong. Please try again.'
      if (friendlyMessage.includes('Quota exceeded') || friendlyMessage.includes('quota') || friendlyMessage.includes('429')) {
        friendlyMessage = '⚠️ API Quota Exceeded (Limit: 0). Your current API key does not have free tier access configured by Google AI Studio. Please generate a standard API key (starting with "AIza...") from Google AI Studio and place it in your .env file.'
      }
      setError(friendlyMessage)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <main className="min-h-screen bg-[#0E0E0E] flex flex-col">
      <div className="gemini-hero">
        <div className="gemini-orb gemini-orb-1" />
        <div className="gemini-orb gemini-orb-2" />
        <div className="gemini-orb gemini-orb-3" />
        <div className="relative z-10 text-center px-6 pt-32 pb-16">
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <img src="/vayu-logo-icon.svg" alt="VAYU" className="h-14 w-auto object-contain filter brightness-0 invert opacity-90" />
            <span className="text-h2 font-bold tracking-[0.1em] text-white opacity-90">VAYU</span>
          </div>
          <div className="inline-flex flex-col items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(192,122,95,0.4)] bg-[rgba(192,122,95,0.08)]">
              <span className="w-2 h-2 rounded-full bg-[#C07A5F] animate-pulse" />
              <span className="text-caption text-[#C07A5F]">
                {GEMINI_API_KEY.startsWith('gsk_') ? 'Powered by Groq Cloud' : 'Powered by Google Gemini'}
              </span>
            </div>
            {isDemoMode && (
              <div className="mt-2 text-caption text-[#C07A5F] bg-[rgba(192,122,95,0.1)] px-3 py-1 rounded border border-[#C07A5F] max-w-[340px]">
                Offline Demo Mode: API key has no remaining quota. Responses are served from local database.
              </div>
            )}
          </div>
          <h1 className="text-display font-display text-white mb-4">
            Vayu<span className="text-[#C07A5F]"> AI</span>
          </h1>
          <p className="text-body-large text-white opacity-60 max-w-[480px] mx-auto">
            Ask anything about ecosystems, carbon footprints, climate, and the living world.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-[800px] w-full mx-auto px-4 pb-4">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <p className="text-caption text-white opacity-40 mb-6">Try asking…</p>
            <div className="flex flex-col gap-3 w-full max-w-[600px]">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => send(p)}
                  className="gemini-suggestion"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-8 space-y-6 gemini-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="gemini-avatar">V</div>
                )}
                <div className={`gemini-bubble ${m.role === 'user' ? 'gemini-bubble-user' : 'gemini-bubble-model'}`}>
                  <MarkdownText text={m.text} />
                </div>
                {m.role === 'user' && (
                  <div className="gemini-avatar gemini-avatar-user">You</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="gemini-avatar">V</div>
                <div className="gemini-bubble gemini-bubble-model">
                  <div className="gemini-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="text-center py-4">
                <p className="text-[#C07A5F] text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-caption text-white opacity-40 hover:opacity-80 mt-2"
                >
                  Dismiss
                </button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="gemini-input-wrap">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about carbon footprints, ecosystems, climate…"
            rows={1}
            className="gemini-input"
            style={{ resize: 'none' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="gemini-send-btn"
            aria-label="Send"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[11px] text-white opacity-20 mt-3 pb-2">
          Vayu AI uses {GEMINI_API_KEY.startsWith('gsk_') ? 'Groq Llama 3.3' : 'Google Gemini'} · Responses may not always be accurate
        </p>
      </div>
    </main>
  )
}

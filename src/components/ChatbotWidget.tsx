import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Welkom bij RIORY! Hoe kan ik u helpen? U kunt vragen stellen over onze diensten, prijzen of een offerte aanvragen." },
  ]);
  const [input, setInput] = useState("");

  const quickReplies = [
    "Wat kost rioleringswerk?",
    "Hoe vraag ik een offerte aan?",
    "In welke regio werken jullie?",
  ];

  const getResponse = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes("kost") || lower.includes("prijs")) {
      return "De kosten hangen af van het type project, de lengte en het grondtype. Gebruik onze kostenraming tool of vraag een gratis offerte aan!";
    }
    if (lower.includes("offerte")) {
      return "U kunt eenvoudig een offerte aanvragen via ons formulier. Scroll naar 'Offerte Aanvragen' of klik hier: #offerte";
    }
    if (lower.includes("regio") || lower.includes("waar")) {
      return "Wij werken voornamelijk in Limburg en omgeving, maar zijn beschikbaar in heel België voor grotere projecten.";
    }
    return "Bedankt voor uw vraag! Voor een gedetailleerd antwoord kunt u ons bereiken via info@riory.be of +32 472 50 28 14.";
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { role: "user" as const, text };
    const botMsg = { role: "bot" as const, text: getResponse(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[480px] bg-background border border-border rounded shadow-2xl flex flex-col">
          <div className="bg-charcoal px-4 py-3 rounded-t">
            <p className="text-sm font-heading font-semibold text-primary-foreground uppercase tracking-wider">
              RIORY Assistent
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm font-body p-3 rounded max-w-[85%] ${
                  msg.role === "bot"
                    ? "bg-surface text-foreground"
                    : "bg-primary text-primary-foreground ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="space-y-2">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="block w-full text-left text-xs font-body px-3 py-2 rounded border border-border hover:border-primary hover:text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Stel een vraag..."
              className="flex-1 h-10 px-3 rounded bg-surface border border-border text-foreground text-sm font-body focus:ring-2 focus:ring-primary outline-none"
            />
            <button
              onClick={() => send(input)}
              className="w-10 h-10 rounded bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;

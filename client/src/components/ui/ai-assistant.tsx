import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  isUser: boolean;
  text: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      isUser: false,
      text: "Hello! I'm your Trader+PLUS assistant. How can I help you with trading or using the platform today?",
      timestamp: new Date()
    }
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      isUser: true,
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate assistant reply after a delay
    setTimeout(() => {
      const assistantResponses: Record<string, string> = {
        "portfolio": "You can track your portfolio performance in the Dashboard section. Navigate to the 'Risk Dashboard' quadrant for a quick overview, or use the full Portfolio Analytics page for detailed metrics and historical performance.",
        "wallet": "To add funds to your wallet, go to the Wallet section and select 'Deposit'. You can add crypto via blockchain transfer or connect your bank account for fiat deposits.",
        "chart": "Our trading charts offer multiple time frames from 1m to 1D, with over 50 technical indicators. You can customize the appearance and save your preferred layouts.",
        "settings": "Account settings can be accessed from your profile page. You can update security preferences, notification settings, and customize your trading interface.",
        "default": "I'd be happy to help with that. Please check our documentation section or ask a more specific question so I can assist you better."
      };
      
      const userQuery = inputValue.toLowerCase();
      let responseText = assistantResponses.default;
      
      for (const [keyword, response] of Object.entries(assistantResponses)) {
        if (userQuery.includes(keyword)) {
          responseText = response;
          break;
        }
      }
      
      const assistantMessage: Message = {
        id: Date.now(),
        isUser: false,
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-zinc-900/50 backdrop-blur-md absolute bottom-0 left-0 right-0 rounded-t-2xl p-5 border-t border-[#2DF2C4]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="material-icons text-[#2DF2C4] mr-2">smart_toy</span>
            <h3 className="font-semibold">Trading Assistant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="material-icons">close</span>
          </Button>
        </div>
        
        <ScrollArea className="h-64 mb-4 bg-zinc-900/70 rounded-xl p-3 space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex items-start gap-2 ${message.isUser ? 'justify-end' : ''} mb-4`}>
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-[#2DF2C4]/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-sm text-[#2DF2C4]">smart_toy</span>
                </div>
              )}
              
              <div className={`bg-zinc-800/70 rounded-lg p-2.5 text-sm max-w-[75%]`}>
                <p>{message.text}</p>
              </div>
              
              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-[#FF2D9A]/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-sm text-[#FF2D9A]">person</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <form onSubmit={handleInputSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask anything about trading..."
            className="bg-zinc-900/70 rounded-xl px-4 py-3 text-sm flex-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2DF2C4] border border-zinc-700"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button 
            type="submit" 
            className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-[#2DF2C4] text-white"
          >
            <span className="material-icons">send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

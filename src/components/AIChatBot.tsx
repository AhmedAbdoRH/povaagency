import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Service, Category, StoreSettings } from '../types/database';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

// =====================
// إعدادات Gemini API
// =====================
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyADRxtILZAQ7EeJA9fKju7tj_YkMErqZH0";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const RenderMessageWithLinks = ({ text }: { text: string }) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(linkRegex);

    return (
        <div className="whitespace-pre-wrap font-medium leading-relaxed">
            {parts.map((part, i) => {
                if (i % 3 === 1) {
                    const url = parts[i + 1];
                    return (
                        <React.Fragment key={i}>
                            <span>{part}</span>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 mb-2 flex items-center justify-center gap-2 text-center bg-accent/20 hover:bg-accent/40 text-accent font-semibold py-2 px-4 rounded-lg transition-all border border-accent/50 shadow-sm"
                            >
                                <ExternalLink className="w-3 h-3" />
                                عرض الخدمة
                            </a>
                        </React.Fragment>
                    );
                }
                if (i % 3 === 2) {
                    return null;
                }
                return <span key={i}>{part}</span>;
            })}
        </div>
    );
};

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'أهلاً بك في POVA Agency 👋\nأنا مساعدك الذكي، جاهز أساعدك في اختيار أفضل الحلول الرقمية لمشروعك. تحب نبدأ بإيه؟',
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [storeData, setStoreData] = useState<{
        services: Service[];
        categories: Category[];
        storeSettings: StoreSettings | null;
    }>({
        services: [],
        categories: [],
        storeSettings: null
    });

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && storeData.services.length === 0) {
            fetchStoreData();
        }
    }, [isOpen]);

    const fetchStoreData = async () => {
        try {
            const { data: services, error: servicesError } = await supabase
                .from('services')
                .select(`
                    *,
                    category:categories(*)
                `)
                .order('created_at', { ascending: false });
            if (servicesError) throw servicesError;

            const { data: categories, error: categoriesError } = await supabase.from('categories').select('*').order('name');
            if (categoriesError) throw categoriesError;

            const { data: storeSettings, error: storeError } = await supabase.from('store_settings').select('*').single();
            if (storeError && storeError.code !== 'PGRST116') console.error('Error fetching store settings:', storeError);

            setStoreData({ services: services || [], categories: categories || [], storeSettings: storeSettings || null });
        } catch (error) {
            console.error('Error fetching store data:', error);
        }
    };

    const generateStoreContext = () => {
        const { services, storeSettings } = storeData;
        let context = `أنت مساعد ذكي ومحترف لموقع "POVA Agency" (وكالة بوفا).\n`;
        context += `نحن وكالة متخصصة في التسويق الرقمي، تصميم الهوية البصرية، تطوير الويب، والموشن جرافيك.\n\n`;

        if (services.length > 0) {
            context += `الخدمات المتاحة لدينا:\n`;
            services.forEach(service => {
                const serviceUrl = `${window.location.origin}/service/${service.id}`;
                context += `\n--- ${service.title} ---\n`;
                context += `الوصف: ${service.description || 'لا يوجد وصف متاح'}\n`;

                if (service.price) context += `السعر: ${service.price} ج.م\n`;
                if (service.sale_price) context += `السعر بعد الخصم: ${service.sale_price} ج.م\n`;

                if (service.category?.name) context += `الفئة: ${service.category.name}\n`;
                context += `الرابط: ${serviceUrl}\n`;
            });
            context += '\n';
        }

        context += `تعليمات الرد:
1. تحدث بلهجة مصرية مهذبة واحترافية (Semi-formal).
2. كن مختصراً ومفيداً. هدفك هو مساعدة العميل في العثور على الخدمة المناسبة أو الإجابة على استفساره.
3. عند اقتراح خدمة، اذكر نبذة عنها وضع رابطها بتنسيق الماركدون: [اسم الخدمة](الرابط).
4. لا تستخدم الجداول.
5. إذا سأل العميل عن الأسعار، اذكر السعر المتاح بوضوح.
6. شجع العميل دائماً على التواصل أو طلب الخدمة.
7. إذا لم تجد خدمة مطابقة تماماً، اقترح الأقرب أو اطلب منه التواصل معنا مباشرة لتفصيل طلب خاص.
8. لا تخترع خدمات غير موجودة في القائمة.
9. استخدم إيموجيز مناسبة لقطاع الأعمال والتكنولوجيا (🚀, 💡, ✨, 📈).
10. رقم التواصل (للطوارئ أو الطلبات الخاصة): +20 100 646 4349
`;

        return context;
    };

    const sendToAI = async (userMessage: string): Promise<string> => {
        const systemPrompt = generateStoreContext();

        const geminiMessages = [
            {
                "role": "user",
                "parts": [{ "text": systemPrompt }]
            },
            {
                "role": "model",
                "parts": [{ "text": "فهمت، أنا جاهز لمساعدة عملاء POVA Agency باحترافية." }]
            },
            {
                "role": "user",
                "parts": [{ "text": userMessage }]
            }
        ];

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: geminiMessages,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`فشل في الاتصال بالخدمة: ${errorData.error.message}`);
            }

            const data = await response.json();
            const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            return textResponse?.trim() || 'عذراً، لم أتمكن من فهم طلبك. هل يمكنك إعادة الصياغة؟';

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return '⚠️ حدث خطأ تقني بسيط، يرجى المحاولة مرة أخرى لاحقاً.';
        }
    };


    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const lastMessageIsFromUser = messages[messages.length - 1]?.isUser;
        const lastElement = container.lastElementChild;

        if (lastMessageIsFromUser || isLoading) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        } else if (lastElement && lastElement instanceof HTMLElement) {
            lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages, isLoading]);

    useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), text: inputText.trim(), isUser: true, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const aiResponse = await sendToAI(userMessage.text);
            setTimeout(() => {
                const botMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponse, isUser: false, timestamp: new Date() };
                setMessages(prev => [...prev, botMessage]);
                setIsLoading(false);
            }, 400);
        } catch (error) {
            const errorMessage: Message = { id: (Date.now() + 1).toString(), text: '⚠️ عذراً، حدث خطأ.', isUser: false, timestamp: new Date() };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 p-4 rounded-full shadow-2xl shadow-accent/30 transition-all text-white bg-accent hover:bg-accent/90 z-50 group border border-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-black"></span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="fixed bottom-24 left-6 w-80 sm:w-96 h-[500px] bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-accent/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30">
                                    <Bot className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">مساعد POVA الذكي</h3>
                                    <p className="text-green-400 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        متصل الآن
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-end gap-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isUser ? 'bg-white/10' : 'bg-accent/10'}`}>
                                            {message.isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-accent" />}
                                        </div>

                                        <div className={`flex flex-col gap-1 ${message.isUser ? 'items-end' : 'items-start'}`}>
                                            <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${message.isUser
                                                    ? 'bg-white text-black rounded-br-none'
                                                    : 'bg-[#2a2a2a] text-gray-200 border border-white/5 rounded-bl-none'
                                                }`}>
                                                <RenderMessageWithLinks text={message.text} />

                                                {!message.isUser && message.id !== '1' && (
                                                    <a
                                                        href="https://wa.me/message/IUSOLSYPTTE6G1"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 flex items-center justify-center gap-2 text-xs bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-semibold py-2 px-3 rounded-lg transition-all border border-[#25D366]/30"
                                                    >
                                                        <MessageSquare className="w-3 h-3" />
                                                        تواصل عبر واتساب
                                                    </a>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-gray-500 px-1">
                                                {message.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                    <div className="flex items-end gap-2">
                                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                                            <Bot className="h-4 w-4 text-accent" />
                                        </div>
                                        <div className="bg-[#2a2a2a] rounded-2xl rounded-bl-none px-4 py-3 border border-white/5">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
                            <div className="flex gap-2 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="اكتب استفسارك هنا..."
                                    disabled={isLoading}
                                    className="flex-1 bg-[#2a2a2a] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 border border-white/5 disabled:opacity-50 transition-all"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputText.trim() || isLoading}
                                    className="bg-accent hover:bg-accent/90 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

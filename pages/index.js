import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ============================================
// THEME: PEARL & SAPPHIRE (Classic Luxury)
// ============================================
const THEME = {
  pearl: '#fdfcfa',
  pearlWarm: '#faf8f5',
  pearlCream: '#f7f5f0',
  sapphire: '#1e3a5f',
  sapphireLight: '#2c5282',
  sapphireDark: '#152a45',
  champagne: '#d4af37',
  champagneLight: '#e8d48a',
  champagneDark: '#b8960c',
  charcoal: '#2d3748',
  charcoalLight: '#4a5568',
  charcoalMuted: '#718096',
  charcoalFaint: '#a0aec0'
};

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  company: {
    name: 'Mirai Investment',
    tagline: 'Think Ahead. Grow Ahead.',
    arn: '319174',
    aum: '₹80+ Cr',
    location: 'Hyderabad, India'
  },
  contact: {
    email: 'miraiglobal.in@gmail.com',
    phone: '+91 8498077190',
    phoneDisplay: '+91 84980 77190',
    whatsappMessage: 'Hi, I visited Mirai Investment website and would like to know more about your services.'
  },
  hero: {
    subtitle: 'Think Ahead. Grow Ahead.',
    description: 'Disciplined wealth creation for those who value foresight, clarity, and long-term thinking.'
  },
  about: {
    title: 'The Future of Your Wealth',
    paragraphs: [
      'Mirai—meaning "future" in Japanese—reflects our forward-thinking approach to wealth creation. We are a professionally managed investment advisory and mutual fund distribution firm committed to helping you build, protect, and grow wealth through disciplined strategies.',
      'With access to multiple reputed AMCs and a research-driven investment approach, we serve individuals and businesses seeking long-term financial clarity. Our foundation is built on trust, transparency, and an unwavering commitment to your financial success.'
    ]
  },
  stats: [
    { value: '₹80+ Cr', label: 'Assets Under Advisory' },
    { value: 'Multiple', label: 'AMC Partnerships' },
    { value: 'Research', label: 'Driven Approach' }
  ],
  philosophy: {
    title: 'Wealth Creation is a Journey, Not a Transaction',
    principles: [
      { title: 'Foresight', text: 'We anticipate market cycles and position portfolios for long-term success, not short-term gains.' },
      { title: 'Discipline', text: 'Emotional decisions erode wealth. Our systematic approach keeps you anchored through volatility.' },
      { title: 'Patience', text: 'Compounding rewards those who wait. We build wealth over years, not quarters.' }
    ]
  },
  services: [
    { title: 'Mutual Fund Distribution', description: 'Equity, Debt, Hybrid, ELSS, and Index Funds across multiple reputed AMCs', icon: '◈' },
    { title: 'SIP & Lumpsum Planning', description: 'Systematic investment strategies tailored to your cash flow and goals', icon: '◇' },
    { title: 'Goal-Based Planning', description: 'Retirement, education, wealth creation—structured around your milestones', icon: '△' },
    { title: 'Portfolio Review', description: 'Regular monitoring, rebalancing, and performance optimization', icon: '○' },
    { title: 'Business Advisory', description: 'Investment solutions designed for corporates and business owners', icon: '□' },
    { title: 'Tax-Efficient Investing', description: 'Strategic allocation to optimize post-tax returns within regulations', icon: '◆' }
  ],
  process: [
    { number: '01', title: 'Understand', description: 'We begin by understanding your goals, risk appetite, and time horizon' },
    { number: '02', title: 'Structure', description: 'Portfolio architecture aligned precisely with your objectives' },
    { number: '03', title: 'Select', description: 'Research-driven fund selection based on suitability, not trends' },
    { number: '04', title: 'Monitor', description: 'Continuous oversight with regular review and communication' },
    { number: '05', title: 'Evolve', description: 'Adaptive strategies that grow with your changing needs' }
  ],
  offers: [
    { title: 'Free Portfolio Health Check', description: 'Get a comprehensive analysis of your existing investments with personalized recommendations.', badge: 'Limited Time' },
    { title: 'SIP Top-Up Consultation', description: 'Maximize your wealth creation with our strategic SIP enhancement guidance.', badge: 'New' },
    { title: 'Tax Planning Session', description: 'ELSS and tax-efficient investment strategies before the financial year ends.', badge: 'Popular' }
  ],
  privacy: {
    title: 'Your Privacy Matters',
    points: [
      'Your information is encrypted and securely stored',
      'We never share your data with third parties',
      'No spam calls or messages',
      'Request data deletion anytime'
    ]
  }
};

// ============================================
// AI CHATBOT COMPONENT - WITH ALL BUG FIXES
// ============================================
const AIChatbot = ({ isOpen, onClose, onSubmitLead }) => {
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [leadData, setLeadData] = useState({
    name: '',
    mobile: '',
    email: '',
    portfolio_interest: '',
    income_category: '',
    city: '',
    reference: ''
  });
  const messagesEndRef = useRef(null);

  // FIX #3: Creative thank you messages (3 rotating variations)
  const getThankYouMessage = (name) => {
    const thankYouMessages = [
      `🎯 Excellent choice, ${name}!\n\nYour future self will thank you for taking this step today. Our investment advisor will personally connect with you within 24 hours via WhatsApp.\n\nIn the meantime, explore how we turn financial goals into reality!`,
      `✨ Welcome to the Mirai family, ${name}!\n\nYou've just taken the first step toward building lasting wealth. Expect a call from our expert advisor within 24 hours.\n\nGreat things start with a single decision—you've made yours!`,
      `🚀 ${name}, your wealth journey begins now!\n\nWe're excited to partner with you. Our advisor will reach out within 24 hours to craft your personalized investment roadmap.\n\nThe future looks bright—let's build it together!`
    ];
    return thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
  };

  const questions = [
    { key: 'welcome', bot: "Hello! 👋 I'm Mirai's investment assistant. I'll help you get started on your wealth creation journey. May I know your name?", field: 'name', placeholder: 'Enter your name' },
    { key: 'mobile', bot: (name) => `Nice to meet you, ${name}! 📱 What's your WhatsApp number? We'll only use this for investment updates.`, field: 'mobile', placeholder: '+91 XXXXX XXXXX' },
    { key: 'email', bot: "Great! 📧 And your email address for detailed portfolio reports?", field: 'email', placeholder: 'your@email.com' },
    { key: 'portfolio', bot: "What type of investments interest you most?", field: 'portfolio_interest', type: 'options', options: ['Equity (High Growth)', 'Debt (Stable Returns)', 'Hybrid (Balanced)', 'ELSS (Tax Saving)', 'Not Sure - Need Guidance'] },
    { key: 'income', bot: "To recommend suitable options, could you share your annual income range?", field: 'income_category', type: 'options', options: ['Below ₹5 Lakhs', '₹5-10 Lakhs', '₹10-25 Lakhs', '₹25-50 Lakhs', '₹50 Lakhs - 1 Crore', 'Above ₹1 Crore'] },
    { key: 'city', bot: "Which city are you based in? 🏙️", field: 'city', placeholder: 'Enter your city' },
    { key: 'reference', bot: "Almost done! Were you referred by someone? (Optional - press Enter to skip)", field: 'reference', placeholder: 'Referrer name (optional)', optional: true },
    { key: 'complete', bot: null, field: null }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      simulateBotMessage(questions[0].bot);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'bot', text: text }]);
    }, 800 + Math.random() * 500);
  };

  const handleSubmit = (value = inputValue) => {
    if (!value.trim() && !questions[step].optional) return;
    
    const currentQuestion = questions[step];
    
    if (value.trim()) {
      setMessages(prev => [...prev, { type: 'user', text: value }]);
    }
    
    // FIX #2: Update lead data - store in a new object to use immediately
    // This ensures we use the correct client name, not the reference name
    const updatedLeadData = { ...leadData };
    if (currentQuestion.field) {
      updatedLeadData[currentQuestion.field] = value.trim();
      setLeadData(updatedLeadData);
    }
    
    setInputValue('');
    
    const nextStep = step + 1;
    if (nextStep < questions.length) {
      setStep(nextStep);
      setTimeout(() => {
        const nextQuestion = questions[nextStep];
        let botText;
        
        if (nextQuestion.key === 'complete') {
          // FIX #2: Use the stored CLIENT NAME from step 0, not the reference name
          const clientName = updatedLeadData.name || leadData.name;
          botText = getThankYouMessage(clientName);
          onSubmitLead(updatedLeadData);
        } else if (typeof nextQuestion.bot === 'function') {
          // For greeting after name, use the name just entered
          botText = nextQuestion.bot(currentQuestion.field === 'name' ? value.trim() : updatedLeadData.name);
        } else {
          botText = nextQuestion.bot;
        }
        
        simulateBotMessage(botText);
      }, 300);
    }
  };

  if (!isOpen) return null;

  const currentQuestion = questions[step];

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      width: '400px',
      maxWidth: 'calc(100vw - 40px)',
      height: '550px',
      maxHeight: 'calc(100vh - 140px)',
      background: `linear-gradient(145deg, rgba(255,255,255,0.98), ${THEME.pearlWarm})`,
      backdropFilter: 'blur(20px)',
      borderRadius: '28px',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1001,
      boxShadow: '0 30px 80px rgba(30, 58, 95, 0.25), 0 0 0 1px rgba(255,255,255,0.5) inset'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem 1.75rem',
        background: `linear-gradient(135deg, ${THEME.sapphire}, ${THEME.sapphireLight})`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 }}>
            Mirai Assistant
          </h3>
          <span style={{ fontSize: '0.75rem', color: THEME.champagneLight, fontFamily: 'Outfit, sans-serif' }}>
            ● Online now
          </span>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          color: '#ffffff',
          fontSize: '1.3rem',
          cursor: 'pointer',
          padding: '0.4rem 0.7rem',
          borderRadius: '10px'
        }}>×</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: THEME.pearl
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%'
          }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderRadius: msg.type === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
              background: msg.type === 'user' 
                ? `linear-gradient(135deg, ${THEME.sapphire}, ${THEME.sapphireLight})` 
                : '#ffffff',
              color: msg.type === 'user' ? '#ffffff' : THEME.charcoal,
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              boxShadow: msg.type === 'user' 
                ? '0 4px 20px rgba(30, 58, 95, 0.3)'
                : '0 2px 12px rgba(30, 58, 95, 0.08)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '1rem 1.25rem',
            borderRadius: '20px 20px 20px 6px',
            background: '#ffffff',
            color: THEME.charcoalMuted,
            fontFamily: 'Outfit, sans-serif'
          }}>
            ● ● ●
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {currentQuestion?.field && !isTyping && (
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid rgba(30, 58, 95, 0.08)',
          background: '#ffffff'
        }}>
          {currentQuestion.type === 'options' ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {currentQuestion.options.map((option, i) => (
                <button key={i} onClick={() => handleSubmit(option)} style={{
                  padding: '0.6rem 1.1rem',
                  background: `linear-gradient(145deg, ${THEME.pearl}, #ffffff)`,
                  border: '1px solid rgba(30, 58, 95, 0.12)',
                  borderRadius: '25px',
                  color: THEME.sapphire,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type={currentQuestion.field === 'email' ? 'email' : 'text'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentQuestion.placeholder}
                style={{
                  flex: 1,
                  padding: '1rem 1.25rem',
                  background: THEME.pearl,
                  border: '2px solid rgba(30, 58, 95, 0.1)',
                  borderRadius: '15px',
                  color: THEME.charcoal,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                autoFocus
              />
              <button type="submit" style={{
                padding: '1rem 1.5rem',
                background: `linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight})`,
                border: 'none',
                borderRadius: '15px',
                color: THEME.sapphireDark,
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 600
              }}>
                →
              </button>
            </form>
          )}
        </div>
      )}

      {/* Privacy Note */}
      <div style={{
        padding: '0.75rem 1.25rem',
        background: `linear-gradient(135deg, ${THEME.pearlCream}, ${THEME.pearl})`,
        textAlign: 'center'
      }}>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', color: THEME.charcoalMuted }}>
          🔒 Your data is encrypted and never shared with third parties
        </span>
      </div>
    </div>
  );
};

// ============================================
// GLOBAL STYLES - FIX #1: Larger section subtitles
// ============================================
const GlobalStyles = () => (
  <style jsx global>{`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: ${THEME.pearlCream}; }
    ::-webkit-scrollbar-thumb { 
      background: linear-gradient(180deg, ${THEME.sapphire}, ${THEME.sapphireLight});
      border-radius: 4px; 
    }
    
    .nav-link {
      position: relative;
      color: ${THEME.charcoalLight};
      text-decoration: none;
      font-family: 'Outfit', sans-serif;
      font-weight: 400;
      font-size: 0.85rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      transition: all 0.3s ease;
      cursor: pointer;
      padding: 0.5rem 0;
    }
    
    .nav-link:hover, .nav-link.active { color: ${THEME.sapphire}; }
    
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, ${THEME.champagne}, ${THEME.champagneLight});
      transition: width 0.3s ease;
      border-radius: 2px;
    }
    
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }
    
    .hero-title {
      font-size: clamp(3.5rem, 10vw, 8rem);
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 0.95;
      color: ${THEME.sapphire};
      opacity: 0;
      transform: translateY(50px);
      animation: fadeUp 1.2s ease forwards;
      animation-delay: 0.3s;
    }
    
    .hero-tagline {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(0.85rem, 1.8vw, 1rem);
      font-weight: 500;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      background: linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight}, ${THEME.champagne});
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: fadeUp 1s ease forwards, shimmer 3s linear infinite;
      animation-delay: 0.6s, 0s;
      opacity: 0;
      transform: translateY(20px);
    }
    
    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    @keyframes glow { 0%, 100% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.2); } 50% { box-shadow: 0 0 50px rgba(212, 175, 55, 0.4); } }
    
    .champagne-line {
      height: 3px;
      background: linear-gradient(90deg, transparent, ${THEME.champagne}, ${THEME.champagneLight}, ${THEME.champagne}, transparent);
      border-radius: 2px;
    }
    
    .pearl-card {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(250, 248, 245, 0.85));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: 24px;
      box-shadow: 0 10px 40px rgba(30, 58, 95, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .pearl-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.7s ease;
    }
    
    .pearl-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 25px 70px rgba(30, 58, 95, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.15);
    }
    
    .pearl-card:hover::before { left: 100%; }
    
    .sapphire-card {
      background: linear-gradient(145deg, ${THEME.sapphire}, ${THEME.sapphireLight});
      border-radius: 28px;
      border: 1px solid rgba(212, 175, 55, 0.2);
      box-shadow: 0 25px 80px rgba(30, 58, 95, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      color: #ffffff;
      position: relative;
      overflow: hidden;
    }
    
    /* FIX #1: Increased section subtitle font size from 0.72rem to 1rem (40% larger) */
    .section-title {
      font-size: clamp(2.5rem, 5vw, 4.5rem);
      font-weight: 300;
      letter-spacing: -0.02em;
      color: ${THEME.sapphire};
      margin-bottom: 1rem;
      line-height: 1.1;
    }
    
    .section-subtitle {
      font-family: 'Outfit', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      background: linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }
    
    .body-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 300;
      font-size: 1.08rem;
      line-height: 1.9;
      color: ${THEME.charcoalLight};
    }
    
    .cta-button-primary {
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 1.3rem 3.5rem;
      background: linear-gradient(135deg, ${THEME.sapphire}, ${THEME.sapphireLight});
      border: none;
      border-radius: 60px;
      color: #ffffff;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(30, 58, 95, 0.35);
    }
    
    .cta-button-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight});
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    
    .cta-button-primary:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 50px rgba(30, 58, 95, 0.4);
    }
    
    .cta-button-primary:hover::before { opacity: 1; }
    .cta-button-primary span { position: relative; z-index: 1; }
    
    .cta-button-secondary {
      font-family: 'Outfit', sans-serif;
      font-size: 0.88rem;
      font-weight: 500;
      letter-spacing: 0.12em;
      padding: 1rem 2.5rem;
      background: transparent;
      border: 2px solid ${THEME.sapphire};
      color: ${THEME.sapphire};
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 50px;
    }
    
    .cta-button-secondary:hover {
      background: ${THEME.sapphire};
      color: #ffffff;
      transform: translateY(-2px);
    }
    
    .service-icon {
      width: 65px;
      height: 65px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(145deg, ${THEME.pearl}, ${THEME.pearlWarm});
      border: 2px solid rgba(212, 175, 55, 0.3);
      border-radius: 18px;
      font-size: 1.6rem;
      color: ${THEME.sapphire};
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
    }
    
    .pearl-card:hover .service-icon {
      background: linear-gradient(145deg, ${THEME.champagne}, ${THEME.champagneLight});
      border-color: ${THEME.champagne};
      color: ${THEME.sapphireDark};
      transform: scale(1.05);
    }
    
    .process-step {
      display: flex;
      gap: 2.5rem;
      align-items: flex-start;
      padding: 2.5rem 2rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
      border-radius: 16px;
      border-left: 3px solid transparent;
      transition: all 0.4s ease;
    }
    
    .process-step:hover {
      background: linear-gradient(90deg, rgba(30, 58, 95, 0.03), rgba(212, 175, 55, 0.05), transparent);
      border-left-color: ${THEME.champagne};
      transform: translateX(10px);
    }
    
    .process-number {
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      background: linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      min-width: 45px;
    }
    
    .stat-card {
      text-align: center;
      padding: 3rem 2rem;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(253, 252, 250, 0.95));
      border-radius: 24px;
      border: 1px solid rgba(212, 175, 55, 0.15);
      box-shadow: 0 8px 30px rgba(30, 58, 95, 0.06);
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, ${THEME.champagne}, ${THEME.champagneLight});
      border-radius: 3px;
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 50px rgba(30, 58, 95, 0.12);
    }
    
    .stat-card:hover::after { opacity: 1; width: 80px; }
    
    .offer-card {
      background: linear-gradient(145deg, rgba(255,255,255,0.98), ${THEME.pearlWarm});
      border: 1px solid rgba(212, 175, 55, 0.2);
      padding: 2.5rem;
      border-radius: 24px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    
    .offer-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 25px 60px rgba(30, 58, 95, 0.12);
    }
    
    .offer-badge {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight});
      color: #ffffff;
      padding: 0.4rem 1rem;
      font-family: 'Outfit', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-radius: 30px;
    }
    
    .whatsapp-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.1rem 2.2rem;
      background: linear-gradient(135deg, #25D366, #128C7E);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.35);
    }
    
    .whatsapp-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(37, 211, 102, 0.45);
    }
    
    .chatbot-trigger {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 68px;
      height: 68px;
      background: linear-gradient(145deg, ${THEME.sapphire}, ${THEME.sapphireLight});
      border: 3px solid rgba(212, 175, 55, 0.4);
      border-radius: 50%;
      color: ${THEME.champagneLight};
      font-size: 1.6rem;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 10px 40px rgba(30, 58, 95, 0.4);
      animation: float 4s ease-in-out infinite, glow 3s ease-in-out infinite;
      transition: all 0.3s ease;
    }
    
    .chatbot-trigger:hover {
      transform: scale(1.1);
      animation-play-state: paused;
      border-color: ${THEME.champagne};
    }
    
    .nav-glass {
      background: linear-gradient(180deg, rgba(253, 252, 250, 0.95), rgba(253, 252, 250, 0.9));
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(212, 175, 55, 0.1);
      box-shadow: 0 4px 30px rgba(30, 58, 95, 0.04);
    }
    
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: ${THEME.sapphire};
      font-size: 1.5rem;
      cursor: pointer;
    }
    
    .decorative-circle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }
    
    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-menu-btn { display: block !important; }
      .mobile-menu {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(180deg, ${THEME.pearl}, ${THEME.pearlWarm});
        backdrop-filter: blur(20px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2.5rem;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.4s ease;
      }
      .mobile-menu.open { transform: translateX(0); }
      .mobile-menu .nav-link { font-size: 1.3rem; }
    }
  `}</style>
);

// ============================================
// MAIN WEBSITE COMPONENT
// ============================================
export default function MiraiInvestment() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['hero', 'about', 'philosophy', 'services', 'offers', 'process', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveLead = async (lead) => {
    if (!supabase) {
      console.log('Supabase not configured, lead data:', lead);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          name: lead.name,
          mobile: lead.mobile,
          email: lead.email,
          portfolio_interest: lead.portfolio_interest,
          income_category: lead.income_category,
          city: lead.city,
          reference: lead.reference || null,
          source: 'website_chatbot',
          status: 'new'
        }]);
      
      if (error) throw error;
    } catch (e) {
      console.error('Failed to save lead:', e);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    if (supabase) {
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email: newsletterEmail }]);
        
        if (error && error.code !== '23505') throw error;
      } catch (e) {
        console.error('Newsletter error:', e);
      }
    }
    
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const whatsappLink = `https://wa.me/${CONFIG.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(CONFIG.contact.whatsappMessage)}`;

  if (!mounted) return null;

  return (
    <div style={{
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      background: `linear-gradient(180deg, ${THEME.pearl} 0%, ${THEME.pearlWarm} 50%, ${THEME.pearlCream} 100%)`,
      color: THEME.charcoal,
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <GlobalStyles />

      {/* Navigation */}
      <nav className="nav-glass" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: scrolled ? '1rem 4rem' : '1.5rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.7rem', fontWeight: 600, letterSpacing: '0.08em', color: THEME.sapphire }}>
          <span style={{ background: `linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>M</span>IRAI
        </div>
        
        <div className="desktop-nav" style={{ display: 'flex', gap: '3rem' }}>
          {['About', 'Philosophy', 'Services', 'Offers', 'Process', 'Contact'].map((item) => (
            <span key={item} className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`} onClick={() => scrollToSection(item.toLowerCase())}>
              {item}
            </span>
          ))}
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>☰</button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: THEME.sapphire, fontSize: '2rem', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(false)}>×</button>
        {['About', 'Philosophy', 'Services', 'Offers', 'Process', 'Contact'].map((item) => (
          <span key={item} className="nav-link" onClick={() => scrollToSection(item.toLowerCase())}>{item}</span>
        ))}
      </div>

      {/* Hero Section */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div className="decorative-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)', top: '5%', right: '5%', filter: 'blur(40px)', position: 'absolute' }} />
        <div className="decorative-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(30, 58, 95, 0.08) 0%, transparent 70%)', bottom: '10%', left: '0%', filter: 'blur(50px)', position: 'absolute' }} />
        
        <div style={{ textAlign: 'center', maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
          <p className="hero-tagline">{CONFIG.hero.subtitle}</p>
          <h1 className="hero-title" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            Mirai<br />
            <span style={{ background: `linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight}, ${THEME.champagne})`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Investment</span>
          </h1>
          <div className="champagne-line" style={{ width: '100px', margin: '2.5rem auto' }} />
          <p className="body-text" style={{ maxWidth: '520px', margin: '0 auto 3.5rem', fontSize: '1.15rem', opacity: 0, animation: 'fadeIn 1s ease forwards', animationDelay: '1s' }}>
            {CONFIG.hero.description}
          </p>
          <button className="cta-button-primary" onClick={() => setChatbotOpen(true)} style={{ opacity: 0, animation: 'fadeIn 1s ease forwards', animationDelay: '1.2s' }}>
            <span>Start Your Journey</span>
          </button>
        </div>
        
        <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: THEME.charcoalMuted }}>Discover</span>
          <div style={{ width: '1px', height: '50px', background: `linear-gradient(180deg, ${THEME.champagne}, transparent)`, borderRadius: '2px' }} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '10rem 4rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '5rem', alignItems: 'center' }}>
          <div>
            <p className="section-subtitle">About Us</p>
            <h2 className="section-title">{CONFIG.about.title}</h2>
          </div>
          <div>
            {CONFIG.about.paragraphs.map((p, i) => (
              <p key={i} className="body-text" style={{ marginBottom: '1.5rem' }}>{p}</p>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginTop: '6rem' }}>
          {CONFIG.stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <p style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 300, background: `linear-gradient(135deg, ${THEME.sapphire}, ${THEME.sapphireLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>{stat.value}</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: THEME.charcoalMuted, fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" style={{ padding: '4rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="sapphire-card" style={{ padding: '5rem', position: 'relative' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: THEME.champagne, marginBottom: '1rem' }}>Our Philosophy</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: '#ffffff', maxWidth: '650px', marginBottom: '4rem', lineHeight: 1.15 }}>
              {CONFIG.philosophy.title}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {CONFIG.philosophy.principles.map((item, i) => (
                <div key={i} style={{ padding: '2.5rem', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.2)', backdropFilter: 'blur(10px)' }}>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 400, marginBottom: '1rem', color: THEME.champagneLight }}>{item.title}</h3>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.98rem', lineHeight: 1.75, color: 'rgba(255, 255, 255, 0.75)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '10rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p className="section-subtitle">Our Services</p>
          <h2 className="section-title">Comprehensive<br />Wealth Solutions</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {CONFIG.services.map((service, i) => (
            <div key={i} className="pearl-card" style={{ padding: '2.8rem' }}>
              <div className="service-icon">{service.icon}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '1rem', color: THEME.sapphire }}>{service.title}</h3>
              <p className="body-text" style={{ fontSize: '0.98rem' }}>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" style={{ padding: '10rem 4rem', background: `linear-gradient(180deg, ${THEME.pearlCream} 0%, ${THEME.pearlWarm} 100%)` }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <p className="section-subtitle">Special Offers</p>
            <h2 className="section-title">Current Opportunities</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
            {CONFIG.offers.map((offer, i) => (
              <div key={i} className="offer-card">
                <span className="offer-badge">{offer.badge}</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '1rem', color: THEME.sapphire, marginTop: '0.5rem', paddingRight: '100px' }}>{offer.title}</h3>
                <p className="body-text" style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>{offer.description}</p>
                <button onClick={() => setChatbotOpen(true)} className="cta-button-secondary">Claim Offer →</button>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(253,252,250,1))', border: '1px solid rgba(30, 58, 95, 0.08)', borderRadius: '30px', padding: '4rem', textAlign: 'center', boxShadow: '0 20px 60px rgba(30, 58, 95, 0.08)' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '0.75rem', color: THEME.sapphire }}>Stay Updated</h3>
            <p className="body-text" style={{ marginBottom: '2rem' }}>Get exclusive investment insights and offers delivered to your inbox</p>
            
            {newsletterSubmitted ? (
              <p style={{ color: THEME.sapphire, fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 500 }}>✓ Thank you! You are now subscribed.</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '1rem', maxWidth: '550px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email" required style={{ flex: '1 1 280px', padding: '1rem 1.5rem', background: THEME.pearl, border: '2px solid rgba(30, 58, 95, 0.1)', borderRadius: '50px', color: THEME.charcoal, fontFamily: 'Outfit, sans-serif', fontSize: '1rem', outline: 'none' }} />
                <button type="submit" style={{ padding: '1rem 2.5rem', background: `linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight})`, border: 'none', borderRadius: '50px', color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)' }}>Subscribe</button>
              </form>
            )}
            
            <p style={{ marginTop: '1.5rem', fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: THEME.charcoalMuted }}>🔒 We respect your privacy. No spam, ever.</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" style={{ padding: '10rem 4rem', background: THEME.pearl }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p className="section-subtitle">Our Process</p>
          <h2 className="section-title" style={{ marginBottom: '4rem' }}>How We Work</h2>
          
          {CONFIG.process.map((step, i) => (
            <div key={i} className="process-step">
              <span className="process-number">{step.number}</span>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, marginBottom: '0.75rem', color: THEME.sapphire }}>{step.title}</h3>
                <p className="body-text" style={{ fontSize: '1rem' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '10rem 4rem', textAlign: 'center', background: `linear-gradient(180deg, ${THEME.pearlCream} 0%, ${THEME.pearl} 100%)` }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p className="section-subtitle">Get Started</p>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Begin Your<br />Investment Journey</h2>
          <p className="body-text" style={{ marginBottom: '3.5rem', fontSize: '1.1rem' }}>Ready to build lasting wealth with a partner who values discipline and transparency? Let's start a conversation.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            <a href={`mailto:${CONFIG.contact.email}`} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 500, background: `linear-gradient(135deg, ${THEME.sapphire}, ${THEME.sapphireLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
              {CONFIG.contact.email}
            </a>
            
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="whatsapp-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
            
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: THEME.charcoalMuted }}>📱 {CONFIG.contact.phoneDisplay} (WhatsApp preferred)</p>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: THEME.charcoalLight }}>{CONFIG.company.location}</p>
          </div>
          
          <div style={{ marginTop: '5rem', padding: '2.5rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(30, 58, 95, 0.06)' }}>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: THEME.sapphire, marginBottom: '1.5rem', letterSpacing: '0.1em', fontWeight: 600 }}>🔒 {CONFIG.privacy.title}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              {CONFIG.privacy.points.map((point, i) => (
                <span key={i} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: THEME.charcoalMuted, padding: '0.6rem 1.2rem', background: THEME.pearlCream, borderRadius: '30px' }}>✓ {point}</span>
              ))}
            </div>
          </div>
          
          <div className="champagne-line" style={{ width: '80px', margin: '4rem auto 2rem' }} />
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: THEME.charcoalMuted, letterSpacing: '0.08em' }}>ARN: {CONFIG.company.arn} | AMFI Registered Mutual Fund Distributor</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 4rem', background: THEME.sapphire, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 600, letterSpacing: '0.08em', color: '#ffffff' }}>
          <span style={{ background: `linear-gradient(135deg, ${THEME.champagne}, ${THEME.champagneLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>M</span>IRAI
        </div>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>© 2025 Mirai Investment. All rights reserved.</p>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', textAlign: 'right' }}>Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully.</p>
      </footer>

      {/* Chatbot Trigger */}
      <button className="chatbot-trigger" onClick={() => setChatbotOpen(!chatbotOpen)}>
        {chatbotOpen ? '×' : '💬'}
      </button>

      {/* AI Chatbot */}
      <AIChatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} onSubmitLead={saveLead} />
    </div>
  );
}

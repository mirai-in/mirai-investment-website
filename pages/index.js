import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CONFIGURATION
// Replace these with your actual Supabase credentials
// ============================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// CONFIGURATION - Edit this section easily
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
    whatsappOnly: true,
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
      'We never share your data with third parties or marketers',
      'No spam calls or messages—only relevant investment updates',
      'You can request data deletion anytime'
    ]
  }
};

// ============================================
// AI CHATBOT COMPONENT
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

  const questions = [
    { key: 'welcome', bot: "Hello! 👋 I'm Mirai's investment assistant. I'll help you get started on your wealth creation journey. May I know your name?", field: 'name', placeholder: 'Enter your name' },
    { key: 'mobile', bot: (name) => `Nice to meet you, ${name}! 📱 What's your WhatsApp number? We'll only use this for investment updates.`, field: 'mobile', placeholder: '+91 XXXXX XXXXX' },
    { key: 'email', bot: "Great! 📧 And your email address for detailed portfolio reports?", field: 'email', placeholder: 'your@email.com' },
    { key: 'portfolio', bot: "What type of investments interest you most?", field: 'portfolio_interest', type: 'options', options: ['Equity (High Growth)', 'Debt (Stable Returns)', 'Hybrid (Balanced)', 'ELSS (Tax Saving)', 'Not Sure - Need Guidance'] },
    { key: 'income', bot: "To recommend suitable options, could you share your annual income range?", field: 'income_category', type: 'options', options: ['Below ₹5 Lakhs', '₹5-10 Lakhs', '₹10-25 Lakhs', '₹25-50 Lakhs', '₹50 Lakhs - 1 Crore', 'Above ₹1 Crore'] },
    { key: 'city', bot: "Which city are you based in? 🏙️", field: 'city', placeholder: 'Enter your city' },
    { key: 'reference', bot: "Almost done! Were you referred by someone? (Optional - press Enter to skip)", field: 'reference', placeholder: 'Referrer name (optional)', optional: true },
    { key: 'complete', bot: (name) => `Thank you, ${name}! ✨ Your information has been securely saved. Our investment advisor will connect with you within 24 hours on WhatsApp. Meanwhile, feel free to explore our services!`, field: null }
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
      const messageText = typeof text === 'function' ? text(leadData.name) : text;
      setMessages(prev => [...prev, { type: 'bot', text: messageText }]);
    }, 800 + Math.random() * 500);
  };

  const handleSubmit = (value = inputValue) => {
    if (!value.trim() && !questions[step].optional) return;
    
    const currentQuestion = questions[step];
    
    if (value.trim()) {
      setMessages(prev => [...prev, { type: 'user', text: value }]);
    }
    
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
        const botText = typeof nextQuestion.bot === 'function' 
          ? nextQuestion.bot(value.trim() || leadData.name) 
          : nextQuestion.bot;
        simulateBotMessage(botText);
        
        if (nextQuestion.key === 'complete') {
          const finalLead = { ...updatedLeadData, [currentQuestion.field]: value.trim() };
          onSubmitLead(finalLead);
        }
      }, 300);
    }
  };

  const handleOptionSelect = (option) => {
    handleSubmit(option);
  };

  if (!isOpen) return null;

  const currentQuestion = questions[step];

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      width: '380px',
      maxWidth: 'calc(100vw - 40px)',
      height: '500px',
      maxHeight: 'calc(100vh - 140px)',
      background: 'linear-gradient(135deg, #0d1421, #0a0f1a)',
      borderRadius: '20px',
      border: '1px solid rgba(201, 162, 39, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1001,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        padding: '1rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15), transparent)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#e8e6e1', fontFamily: '"Cormorant Garamond", serif' }}>
            Mirai Assistant
          </h3>
          <span style={{ fontSize: '0.7rem', color: '#c9a227', fontFamily: 'Outfit, sans-serif' }}>
            ● Online
          </span>
        </div>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          color: '#a0a0a0',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '0.25rem'
        }}>×</button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%'
          }}>
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: msg.type === 'user' ? '15px 15px 5px 15px' : '15px 15px 15px 5px',
              background: msg.type === 'user' 
                ? 'linear-gradient(135deg, #c9a227, #a88b1f)' 
                : 'rgba(255,255,255,0.08)',
              color: msg.type === 'user' ? '#0a0f1a' : '#e8e6e1',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '0.75rem 1rem',
            borderRadius: '15px 15px 15px 5px',
            background: 'rgba(255,255,255,0.08)',
            color: '#a0a0a0',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.9rem'
          }}>
            ● ● ●
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {currentQuestion?.field && !isTyping && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(201, 162, 39, 0.2)'
        }}>
          {currentQuestion.type === 'options' ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {currentQuestion.options.map((option, i) => (
                <button key={i} onClick={() => handleOptionSelect(option)} style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(201, 162, 39, 0.1)',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                  borderRadius: '20px',
                  color: '#e8e6e1',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type={currentQuestion.field === 'email' ? 'email' : 'text'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentQuestion.placeholder}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                  borderRadius: '10px',
                  color: '#e8e6e1',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
                autoFocus
              />
              <button type="submit" style={{
                padding: '0.75rem 1.25rem',
                background: '#c9a227',
                border: 'none',
                borderRadius: '10px',
                color: '#0a0f1a',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                →
              </button>
            </form>
          )}
        </div>
      )}

      <div style={{
        padding: '0.5rem 1rem',
        background: 'rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '0.65rem',
          color: '#666'
        }}>
          🔒 Your data is secure and never shared
        </span>
      </div>
    </div>
  );
};

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

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
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
      console.log('Lead saved successfully');
    } catch (e) {
      console.error('Failed to save lead:', e);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: newsletterEmail }]);
      
      if (error && error.code !== '23505') {
        throw error;
      }
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
    } catch (e) {
      console.error('Newsletter signup failed:', e);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const whatsappLink = `https://wa.me/${CONFIG.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(CONFIG.contact.whatsappMessage)}`;

  if (!mounted) {
    return null;
  }

  return (
    <div style={{
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      backgroundColor: '#0a0f1a',
      color: '#e8e6e1',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1a; }
        ::-webkit-scrollbar-thumb { background: #c9a227; border-radius: 3px; }
        
        .nav-link {
          position: relative;
          color: #a0a0a0;
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: color 0.3s ease;
          cursor: pointer;
        }
        
        .nav-link:hover, .nav-link.active { color: #c9a227; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #c9a227;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        
        .hero-title {
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          line-height: 1;
          opacity: 0;
          transform: translateY(40px);
          animation: fadeUp 1.2s ease forwards;
          animation-delay: 0.3s;
        }
        
        .hero-tagline {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a227;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1s ease forwards;
          animation-delay: 0.6s;
        }
        
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        .gold-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a227, transparent);
          transform-origin: center;
          animation: lineGrow 1.5s ease forwards;
          animation-delay: 0.8s;
          opacity: 0.6;
        }
        
        .section-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          letter-spacing: -0.01em;
          margin-bottom: 1rem;
        }
        
        .section-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c9a227;
          margin-bottom: 0.5rem;
        }
        
        .body-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #a0a0a0;
        }
        
        .service-card {
          background: linear-gradient(135deg, rgba(20, 30, 48, 0.8), rgba(10, 15, 26, 0.9));
          border: 1px solid rgba(201, 162, 39, 0.15);
          padding: 2.5rem;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        
        .service-card:hover {
          border-color: rgba(201, 162, 39, 0.4);
          transform: translateY(-4px);
        }
        
        .offer-card {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.08), rgba(10, 15, 26, 0.9));
          border: 1px solid rgba(201, 162, 39, 0.25);
          padding: 2rem;
          border-radius: 8px;
          transition: all 0.4s ease;
          position: relative;
        }
        
        .offer-card:hover {
          transform: translateY(-5px);
          border-color: #c9a227;
          box-shadow: 0 15px 40px rgba(201, 162, 39, 0.15);
        }
        
        .offer-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          background: #c9a227;
          color: #0a0f1a;
          padding: 0.25rem 0.75rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        
        .process-step {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          padding: 2rem 0;
          border-bottom: 1px solid rgba(201, 162, 39, 0.1);
          transition: all 0.3s ease;
        }
        
        .process-step:hover {
          padding-left: 1rem;
          border-color: rgba(201, 162, 39, 0.3);
        }
        
        .cta-button {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 1.2rem 3rem;
          background: transparent;
          border: 1px solid #c9a227;
          color: #c9a227;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        
        .cta-button:hover { 
          color: #0a0f1a; 
          background: #c9a227;
        }
        
        .whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #25D366;
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .whatsapp-btn:hover {
          background: #128C7E;
          transform: scale(1.05);
        }
        
        .chatbot-trigger {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #c9a227, #a88b1f);
          border: none;
          border-radius: 50%;
          color: #0a0f1a;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 5px 25px rgba(201, 162, 39, 0.4);
          animation: float 3s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        
        .chatbot-trigger:hover {
          transform: scale(1.1);
          animation-play-state: paused;
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #c9a227;
          font-size: 1.5rem;
          cursor: pointer;
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
            background: rgba(10, 15, 26, 0.98);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.4s ease;
          }
          .mobile-menu.open { transform: translateX(0); }
          .mobile-menu .nav-link { font-size: 1.2rem; }
        }
      `}</style>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        background: 'linear-gradient(180deg, rgba(10, 15, 26, 0.95), transparent)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1.5rem', 
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: '#e8e6e1'
        }}>
          <span style={{ color: '#c9a227' }}>M</span>IRAI
        </div>
        
        <div className="desktop-nav" style={{ display: 'flex', gap: '3rem' }}>
          {['About', 'Philosophy', 'Services', 'Offers', 'Process', 'Contact'].map((item) => (
            <span 
              key={item} 
              className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
              onClick={() => scrollToSection(item.toLowerCase())}
            >
              {item}
            </span>
          ))}
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>☰</button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#c9a227', fontSize: '2rem', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(false)}>×</button>
        {['About', 'Philosophy', 'Services', 'Offers', 'Process', 'Contact'].map((item) => (
          <span key={item} className="nav-link" onClick={() => scrollToSection(item.toLowerCase())}>{item}</span>
        ))}
      </div>

      {/* Hero Section */}
      <section id="hero" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <p className="hero-tagline">{CONFIG.hero.subtitle}</p>
          <h1 className="hero-title" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            Mirai<br />
            <span style={{ color: '#c9a227' }}>Investment</span>
          </h1>
          <div className="gold-line" style={{ width: '120px', margin: '2rem auto' }} />
          <p className="body-text" style={{ 
            maxWidth: '500px', 
            margin: '0 auto 3rem',
            opacity: 0,
            animation: 'fadeIn 1s ease forwards',
            animationDelay: '1s'
          }}>
            {CONFIG.hero.description}
          </p>
          <button 
            className="cta-button"
            onClick={() => setChatbotOpen(true)}
            style={{
              opacity: 0,
              animation: 'fadeIn 1s ease forwards',
              animationDelay: '1.2s'
            }}
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '8rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
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
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem',
          marginTop: '5rem',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(201, 162, 39, 0.2)'
        }}>
          {CONFIG.stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#c9a227', marginBottom: '0.5rem' }}>{stat.value}</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a0a0a0' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" style={{ padding: '8rem 4rem', background: 'linear-gradient(180deg, rgba(20, 30, 48, 0.5), rgba(10, 15, 26, 0.8))' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="section-subtitle">Our Philosophy</p>
          <h2 className="section-title" style={{ maxWidth: '600px', marginBottom: '3rem' }}>{CONFIG.philosophy.title}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {CONFIG.philosophy.principles.map((item, i) => (
              <div key={i} style={{ padding: '2rem 0', borderTop: '1px solid rgba(201, 162, 39, 0.3)' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 400, marginBottom: '1rem', color: '#e8e6e1' }}>{item.title}</h3>
                <p className="body-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '8rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-subtitle">Our Services</p>
          <h2 className="section-title">Comprehensive<br />Wealth Solutions</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {CONFIG.services.map((service, i) => (
            <div key={i} className="service-card">
              <span style={{ fontSize: '1.5rem', color: '#c9a227', marginBottom: '1.5rem', display: 'block' }}>{service.icon}</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '1rem', color: '#e8e6e1' }}>{service.title}</h3>
              <p className="body-text" style={{ fontSize: '0.95rem' }}>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" style={{ padding: '8rem 4rem', background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.03), rgba(10, 15, 26, 0.95))' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-subtitle">Special Offers</p>
            <h2 className="section-title">Current Opportunities</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {CONFIG.offers.map((offer, i) => (
              <div key={i} className="offer-card">
                <span className="offer-badge">{offer.badge}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '1rem', color: '#e8e6e1', marginTop: '0.5rem' }}>{offer.title}</h3>
                <p className="body-text" style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>{offer.description}</p>
                <button onClick={() => setChatbotOpen(true)} style={{
                  background: 'transparent',
                  border: '1px solid #c9a227',
                  color: '#c9a227',
                  padding: '0.5rem 1.5rem',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  Claim Offer →
                </button>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(10, 15, 26, 0.8))',
            border: '1px solid rgba(201, 162, 39, 0.2)',
            borderRadius: '10px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem', color: '#e8e6e1' }}>Stay Updated</h3>
            <p className="body-text" style={{ marginBottom: '1.5rem' }}>Get exclusive investment insights and offers delivered to your inbox</p>
            
            {newsletterSubmitted ? (
              <p style={{ color: '#c9a227', fontFamily: 'Outfit, sans-serif' }}>✓ Thank you! You are now subscribed.</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    flex: '1 1 250px',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201, 162, 39, 0.3)',
                    borderRadius: '5px',
                    color: '#e8e6e1',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                />
                <button type="submit" style={{
                  padding: '0.75rem 2rem',
                  background: '#c9a227',
                  border: 'none',
                  borderRadius: '5px',
                  color: '#0a0f1a',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>
                  Subscribe
                </button>
              </form>
            )}
            
            <p style={{ marginTop: '1rem', fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#666' }}>
              🔒 We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" style={{ padding: '8rem 4rem', background: 'linear-gradient(180deg, rgba(10, 15, 26, 1), rgba(20, 30, 48, 0.3))' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="section-subtitle">Our Process</p>
          <h2 className="section-title" style={{ marginBottom: '3rem' }}>How We Work</h2>
          
          {CONFIG.process.map((step, i) => (
            <div key={i} className="process-step">
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 400, color: '#c9a227', letterSpacing: '0.1em', minWidth: '40px' }}>{step.number}</span>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem', color: '#e8e6e1' }}>{step.title}</h3>
                <p className="body-text" style={{ fontSize: '0.95rem' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '8rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p className="section-subtitle">Get Started</p>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Begin Your<br />Investment Journey</h2>
          <p className="body-text" style={{ marginBottom: '3rem' }}>
            Ready to build lasting wealth with a partner who values discipline and transparency? Let us start a conversation.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <a href={`mailto:${CONFIG.contact.email}`} style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1rem',
              color: '#c9a227',
              textDecoration: 'none',
              letterSpacing: '0.05em'
            }}>
              {CONFIG.contact.email}
            </a>
            
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="whatsapp-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
            
            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.8rem',
              color: '#666',
              marginTop: '0.5rem'
            }}>
              📱 {CONFIG.contact.phoneDisplay} (WhatsApp texts preferred)
            </p>
            
            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.9rem',
              color: '#a0a0a0',
              letterSpacing: '0.05em'
            }}>
              {CONFIG.company.location}
            </p>
          </div>
          
          {/* Privacy Section */}
          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h4 style={{ 
              fontFamily: 'Outfit, sans-serif', 
              fontSize: '0.9rem', 
              color: '#c9a227', 
              marginBottom: '1rem',
              letterSpacing: '0.1em'
            }}>
              🔒 {CONFIG.privacy.title}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              {CONFIG.privacy.points.map((point, i) => (
                <span key={i} style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.75rem',
                  color: '#666',
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '20px'
                }}>
                  ✓ {point}
                </span>
              ))}
            </div>
          </div>
          
          <div className="gold-line" style={{ width: '60px', margin: '3rem auto' }} />
          
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.75rem',
            color: '#666',
            letterSpacing: '0.05em'
          }}>
            ARN: {CONFIG.company.arn} | AMFI Registered Mutual Fund Distributor
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 4rem',
        borderTop: '1px solid rgba(201, 162, 39, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ 
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1.2rem', 
          fontWeight: 500,
          letterSpacing: '0.1em'
        }}>
          <span style={{ color: '#c9a227' }}>M</span>IRAI
        </div>
        
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#666', letterSpacing: '0.05em' }}>
          © 2025 Mirai Investment. All rights reserved.
        </p>
        
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', color: '#555', maxWidth: '400px', textAlign: 'right' }}>
          Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully.
        </p>
      </footer>

      {/* Chatbot Trigger */}
      <button className="chatbot-trigger" onClick={() => setChatbotOpen(!chatbotOpen)}>
        {chatbotOpen ? '×' : '💬'}
      </button>

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        onSubmitLead={saveLead}
      />
    </div>
  );
}

import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, ChevronUp, Rocket, Monitor, Headphones, DollarSign, MapPin, Phone, Mail, Twitter, Facebook, Linkedin, Instagram, ArrowRight, Menu, X, CheckCircle2, Globe } from 'lucide-react';
import { LanguageContext } from '../App';

// Custom Hook for Scroll Animations
const useElementOnScreen = (options: any) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries: any) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
        setIsVisible(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

// Animated Section Component
const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    // @ts-ignore
    const [ref, isVisible] = useElementOnScreen({ root: null, rootMargin: "0px", threshold: 0.1 });
    return (
        <div 
            // @ts-ignore
            ref={ref} 
            className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

const Landing: React.FC = () => {
  const { t, dir } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      navigate('/login');
  };

  const toggleFaq = (idx: number) => {
      setOpenFaq(openFaq === idx ? null : idx);
  };

  const SideNavLink = ({ href, label, icon }: { href: string, label: string, icon?: React.ReactNode }) => (
      <a 
        href={href} 
        onClick={() => setMobileMenuOpen(false)}
        className="flex items-center gap-3 px-6 py-4 text-gray-400 hover:text-white hover:bg-slate-800/50 hover:border-r-4 hover:border-primary transition-all duration-300 group"
      >
          {icon && <span className="group-hover:text-primary transition-colors">{icon}</span>}
          <span className="font-medium tracking-wide uppercase text-sm">{label}</span>
      </a>
  );

  return (
    <div className={`bg-darker min-h-screen text-gray-100 font-sans overflow-x-hidden flex ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* --- SIDE NAVIGATION (Desktop) --- */}
      <aside className={`hidden lg:flex flex-col w-80 h-screen fixed top-0 ${dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'} border-slate-800 bg-card z-50`}>
          {/* Logo Area */}
          <div className="p-10 flex items-center gap-3">
               <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Zap className="text-white" size={28} fill="currentColor" />
               </div>
               <div>
                   <h1 className="text-2xl font-extrabold tracking-tight text-white">ATL3 TREND</h1>
                   <p className="text-xs text-primary tracking-widest uppercase">SMM Panel</p>
               </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col py-6">
              <SideNavLink href="#" label={t('home')} icon={<Monitor size={18} />} />
              <SideNavLink href="#AddFunds" label={t('addFunds')} icon={<Globe size={18} />} />
              <SideNavLink href="#services" label={t('services')} icon={<Rocket size={18} />} />
              <SideNavLink href="#Tickets" label={t('tickets')} icon={<Mail size={18} />} />
          </nav>

          {/* Auth Buttons Area */}
          <div className="p-8 mt-auto space-y-4">
              <div className="bg-darker p-4 rounded-xl border border-slate-800 text-center">
                  <p className="text-xs text-gray-500 mb-3">Ready to boost your reach?</p>
                  <Link to="/login" className="block w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors mb-2">
                      {t('login')}
                  </Link>
                  <Link to="/signup" className="block w-full py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/25">
                      {t('signup')}
                  </Link>
              </div>
              <div className="flex justify-center gap-4 text-gray-500">
                  <a href="#" className="hover:text-white transition-colors"><Twitter size={18}/></a>
                  <a href="#" className="hover:text-white transition-colors"><Instagram size={18}/></a>
                  <a href="#" className="hover:text-white transition-colors"><Facebook size={18}/></a>
              </div>
          </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-card/90 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Zap className="text-white" size={18} fill="currentColor" />
                </div>
                <span className="font-bold text-xl">ATL3 TREND</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
              {mobileMenuOpen ? <X /> : <Menu />}
          </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden bg-darker pt-20 px-6 pb-6 flex flex-col animate-in slide-in-from-top-10">
              <nav className="flex flex-col gap-4 text-center">
                  <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium py-2 border-b border-slate-800">{t('home')}</a>
                  <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium py-2 border-b border-slate-800">{t('aboutUs')}</a>
                  <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium py-2 border-b border-slate-800">{t('ourServices')}</a>
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium py-2 border-b border-slate-800">{t('contactUs')}</a>
              </nav>
              <div className="mt-auto gap-4 flex flex-col">
                  <Link to="/login" className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-center">{t('login')}</Link>
                  <Link to="/signup" className="w-full py-4 bg-primary text-white rounded-xl font-bold text-center">{t('signup')}</Link>
              </div>
          </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className={`flex-1 relative ${dir === 'rtl' ? 'lg:mr-80' : 'lg:ml-80'}`}>
          
          {/* HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
              {/* Background Gradients */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
                  <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>
              </div>

              <div className="container max-w-5xl mx-auto text-center relative z-10">
                  <AnimatedSection>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-primary text-sm font-semibold mb-8 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        #1 SMM Panel in Egypt & Worldwide
                    </div>
                  </AnimatedSection>

                  <AnimatedSection delay={200}>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-4 tracking-widest uppercase">{t('heroTitle')}</h3>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-none tracking-tight text-white">
                        {t('heroSubtitle')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">
                            {t('heroDesc')}
                        </span>
                    </h1>
                  </AnimatedSection>

                  {/* Login/CTA Box */}
                  <AnimatedSection delay={400}>
                    <div className="max-w-xl mx-auto bg-card/30 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex flex-col gap-2 p-2">
                            <input 
                                type="email" 
                                placeholder={t('heroFormPlaceholder1')} 
                                className="bg-darker/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none text-sm"
                            />
                            <input 
                                type="password" 
                                placeholder={t('heroFormPlaceholder2')} 
                                className="bg-darker/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none text-sm"
                            />
                        </div>
                        <button onClick={handleLogin} className="bg-primary hover:bg-secondary text-white font-bold px-8 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 md:w-auto py-4 md:py-0">
                            {t('heroBtn')} <ArrowRight size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                        </button>
                    </div>
                    <div className="mt-6">
                        <Link to="/signup" className="text-gray-400 hover:text-white text-sm underline decoration-dotted underline-offset-4">
                            {t('createAccount')}
                        </Link>
                    </div>
                  </AnimatedSection>
              </div>
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
                  <ChevronDown size={32} />
              </div>
          </section>

          {/* FEATURES GRID */}
          <section className="py-24 bg-darker relative" id="services">
              <div className="container max-w-6xl mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                          { icon: Rocket, title: t('feature1Title'), desc: t('feature1Desc'), color: 'blue' },
                          { icon: DollarSign, title: t('feature2Title'), desc: t('feature2Desc'), color: 'green' },
                          { icon: Monitor, title: t('feature3Title'), desc: t('feature3Desc'), color: 'purple' },
                          { icon: Headphones, title: t('feature4Title'), desc: t('feature4Desc'), color: 'orange' }
                      ].map((feature, idx) => (
                          <AnimatedSection key={idx} delay={idx * 100} className="h-full">
                              <div className="h-full bg-card border border-slate-800 p-8 rounded-2xl hover:border-slate-600 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
                                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-${feature.color}-500/10 text-${feature.color}-500 group-hover:bg-${feature.color}-500 group-hover:text-white transition-all duration-300`}>
                                      <feature.icon size={28} />
                                  </div>
                                  <h4 className="text-xl font-bold text-white mb-4">{feature.title}</h4>
                                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                              </div>
                          </AnimatedSection>
                      ))}
                  </div>
              </div>
          </section>

          {/* ABOUT SECTION */}
          <section className="py-32 bg-card/20 relative" id="about">
              <div className="container max-w-6xl mx-auto px-6">
                  <div className="flex flex-col lg:flex-row items-center gap-20">
                      <div className="lg:w-1/2">
                          <AnimatedSection>
                              <div className="relative group">
                                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                  <img 
                                      src="https://img.freepik.com/free-photo/social-media-marketing-concept-marketing-with-applications_23-2150063163.jpg" 
                                      alt="About SMM" 
                                      className="relative rounded-3xl border border-slate-700 shadow-2xl w-full transform transition-transform duration-500 group-hover:scale-[1.02]"
                                  />
                                  {/* Floating Badge */}
                                  <div className="absolute -bottom-10 -right-10 bg-darker border border-slate-700 p-6 rounded-2xl shadow-xl hidden md:block">
                                      <div className="flex items-center gap-4">
                                          <div className="text-4xl font-bold text-primary">1.5M+</div>
                                          <div className="text-xs text-gray-400 uppercase font-bold">Orders<br/>Completed</div>
                                      </div>
                                  </div>
                              </div>
                          </AnimatedSection>
                      </div>
                      <div className="lg:w-1/2">
                          <AnimatedSection delay={200}>
                              <h6 className="text-primary font-bold uppercase tracking-widest mb-4 text-sm">{t('aboutTitle')}</h6>
                              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">{t('aboutHeading')}</h2>
                              <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-4 border-primary/30 pl-6">
                                  {t('aboutText')}
                              </p>
                              
                              <div className="grid grid-cols-2 gap-6 mb-10">
                                  <div className="flex items-center gap-3">
                                      <CheckCircle2 className="text-green-500" />
                                      <span className="text-white font-medium">Real-time Analytics</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <CheckCircle2 className="text-green-500" />
                                      <span className="text-white font-medium">Secure Payments</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <CheckCircle2 className="text-green-500" />
                                      <span className="text-white font-medium">API Support</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <CheckCircle2 className="text-green-500" />
                                      <span className="text-white font-medium">24/7 Live Chat</span>
                                  </div>
                              </div>

                              <Link to="/services" className="inline-flex items-center gap-3 bg-white text-darker px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                  {t('viewAllServices')} <ArrowRight size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                              </Link>
                          </AnimatedSection>
                      </div>
                  </div>
              </div>
          </section>

          {/* COUNTERS */}
          <section className="py-20 bg-darker border-y border-slate-800/50">
              <div className="container max-w-6xl mx-auto px-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {[
                          { num: "330+", label: t('counter1'), color: "text-blue-400" },
                          { num: "850+", label: t('counter2'), color: "text-purple-400" },
                          { num: "25+", label: t('counter3'), color: "text-green-400" },
                          { num: "10+", label: t('counter4'), color: "text-orange-400" },
                      ].map((stat, idx) => (
                          <AnimatedSection key={idx} delay={idx * 100} className="text-center p-6 bg-card/30 rounded-2xl border border-slate-800/50 hover:border-slate-700 hover:bg-card/50 transition-all">
                              <div className={`text-4xl md:text-5xl font-black ${stat.color} mb-2`}>{stat.num}</div>
                              <div className="text-gray-400 font-medium text-sm uppercase tracking-wide">{stat.label}</div>
                          </AnimatedSection>
                      ))}
                  </div>
              </div>
          </section>

          {/* FAQ SECTION */}
          <section className="py-32 bg-darker relative overflow-hidden">
              <div className="container max-w-4xl mx-auto px-6 relative z-10">
                  <AnimatedSection className="text-center mb-16">
                      <h6 className="text-primary font-bold uppercase tracking-widest mb-4 text-sm">{t('faqTitle')}</h6>
                      <h2 className="text-4xl font-bold text-white">{t('faqHeading')}</h2>
                  </AnimatedSection>
                  
                  <div className="space-y-4">
                      {[1, 2, 3, 4].map((num, idx) => (
                          <AnimatedSection key={num} delay={idx * 100}>
                              <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === num ? 'bg-card border-primary/50 shadow-lg shadow-primary/5' : 'bg-card/30 border-slate-800 hover:border-slate-700'}`}>
                                  <button 
                                    onClick={() => toggleFaq(num)}
                                    className="w-full flex items-center justify-between p-6 text-left font-bold text-white text-lg"
                                  >
                                      {/* @ts-ignore */}
                                      <span>{t(`faq${num}Q`)}</span>
                                      <div className={`p-2 rounded-full ${openFaq === num ? 'bg-primary text-white' : 'bg-slate-800 text-gray-400'}`}>
                                         {openFaq === num ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                      </div>
                                  </button>
                                  <div className={`transition-all duration-300 overflow-hidden ${openFaq === num ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                      <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-slate-800/50 mt-2">
                                          {/* @ts-ignore */}
                                          <p>{t(`faq${num}A`)}</p>
                                      </div>
                                  </div>
                              </div>
                          </AnimatedSection>
                      ))}
                  </div>
              </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="py-32 bg-gradient-to-b from-card/20 to-darker relative">
              <div className="container max-w-6xl mx-auto px-6">
                  <AnimatedSection className="mb-16">
                      <h2 className="text-3xl font-bold text-white mb-4 border-l-4 border-primary pl-4">{t('testimonialsHeading')}</h2>
                      <p className="text-gray-400">{t('testimonialsTitle')}</p>
                  </AnimatedSection>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <AnimatedSection delay={100}>
                          <div className="bg-card p-10 rounded-3xl border border-slate-800 relative">
                              <div className="text-6xl text-primary/20 absolute top-6 right-6 font-serif">"</div>
                              <p className="text-gray-300 text-lg italic mb-8 relative z-10">{t('testi1Text')}</p>
                              <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-0.5">
                                      <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-full h-full rounded-full border-2 border-darker" />
                                  </div>
                                  <div>
                                      <h5 className="font-bold text-white">{t('testi1Name')}</h5>
                                      <span className="text-xs text-primary font-bold uppercase tracking-wider">{t('testi1Role')}</span>
                                  </div>
                              </div>
                          </div>
                      </AnimatedSection>
                      <AnimatedSection delay={200}>
                          <div className="bg-card p-10 rounded-3xl border border-slate-800 relative">
                              <div className="text-6xl text-primary/20 absolute top-6 right-6 font-serif">"</div>
                              <p className="text-gray-300 text-lg italic mb-8 relative z-10">{t('testi2Text')}</p>
                              <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-0.5">
                                      <img src="https://i.pravatar.cc/150?u=a04258a2462d826712d" alt="User" className="w-full h-full rounded-full border-2 border-darker" />
                                  </div>
                                  <div>
                                      <h5 className="font-bold text-white">{t('testi2Name')}</h5>
                                      <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">{t('testi2Role')}</span>
                                  </div>
                              </div>
                          </div>
                      </AnimatedSection>
                  </div>
              </div>
          </section>

          {/* CTA */}
          <section className="py-32 relative overflow-hidden" id="contact">
               <div className="absolute inset-0 bg-primary/10"></div>
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
               
               <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
                   <AnimatedSection>
                       <h2 className="text-4xl md:text-6xl font-black text-white mb-8">{t('ctaTitle')}</h2>
                       <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">{t('ctaText')}</p>
                       <Link to="/signup" className="inline-flex items-center gap-3 bg-white text-darker px-12 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-white/10">
                           {t('startNow')} <Rocket size={24} className="text-primary" />
                       </Link>
                   </AnimatedSection>
               </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-darker border-t border-slate-800 pt-20 pb-10">
               <div className="container max-w-6xl mx-auto px-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                       <div className="text-center p-6 bg-card rounded-2xl border border-slate-800">
                           <div className="w-12 h-12 bg-darker rounded-full flex items-center justify-center mx-auto mb-4 text-primary border border-slate-700">
                               <MapPin />
                           </div>
                           <h6 className="font-bold text-white mb-2">{t('footerAddress')}</h6>
                           <p className="text-gray-400 text-sm">Online Services</p>
                       </div>
                       <div className="text-center p-6 bg-card rounded-2xl border border-slate-800">
                           <div className="w-12 h-12 bg-darker rounded-full flex items-center justify-center mx-auto mb-4 text-primary border border-slate-700">
                               <Mail />
                           </div>
                           <h6 className="font-bold text-white mb-2">{t('footerPO')}</h6>
                           <p className="text-gray-400 text-sm">support@nexus-smm.com</p>
                       </div>
                       <div className="text-center p-6 bg-card rounded-2xl border border-slate-800">
                           <div className="w-12 h-12 bg-darker rounded-full flex items-center justify-center mx-auto mb-4 text-primary border border-slate-700">
                               <Phone />
                           </div>
                           <h6 className="font-bold text-white mb-2">{t('footerPhone')}</h6>
                           <p className="text-gray-400 text-sm">800-456-478-23</p>
                       </div>
                   </div>
                   
                   <div className="text-center border-t border-slate-800 pt-10">
                       <div className="flex items-center justify-center gap-2 mb-4">
                           <Zap className="text-primary" size={20} />
                           <span className="font-bold text-xl text-white">ATL3 TREND</span>
                       </div>
                       <p className="text-gray-600 text-sm">{t('copyright')}</p>
                   </div>
               </div>
          </footer>
      </main>
    </div>
  );
};

export default Landing;
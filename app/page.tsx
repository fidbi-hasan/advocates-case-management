"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scale, Gavel, BookOpen, FileText, ShieldCheck, Clock,
  ArrowRight, Phone, Mail, MapPin, Award, Menu, X, ChevronRight,
} from "lucide-react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const linkClass = scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/60" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg transition-colors ${scrolled ? "bg-slate-900" : "bg-white/10 backdrop-blur-sm border border-white/20"}`}>
              <Scale className={`w-5 h-5 ${scrolled ? "text-amber-400" : "text-amber-300"}`} strokeWidth={1.5} />
            </div>
            <div>
              <span className={`font-serif-display text-lg font-bold tracking-tight ${scrolled ? "text-slate-900" : "text-white"}`}>Advocate Karim</span>
              <p className={`text-[10px] font-body -mt-0.5 ${scrolled ? "text-slate-400" : "text-white/50"}`}>Law Chambers</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["About", "Practice", "Experience", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`text-sm font-medium font-body transition-colors ${linkClass}`}>{item}</a>
            ))}
            <Link href="/login" className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold font-body transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105 active:scale-95 flex items-center gap-2">
              Login <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
            {mobileOpen ? <X className={`w-5 h-5 ${scrolled ? "text-slate-900" : "text-white"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? "text-slate-900" : "text-white"}`} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            {["About", "Practice", "Experience", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-700 font-body py-2">{item}</a>
            ))}
            <Link href="/login" className="block bg-slate-900 text-white text-center px-4 py-2.5 rounded-lg text-sm font-semibold font-body">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function HomePage() {
  return (
    <div className="font-body overflow-x-hidden">
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center gradient-premium overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-office.png" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 gradient-premium opacity-75" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-float-slow" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft" />
                <span className="text-xs text-white/70 font-medium">25+ Years of Legal Excellence</span>
              </div>
              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Advocate<br />Abdul Karim
              </h1>
              <div className="gold-accent-line mb-6" />
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl mb-4">
                Senior Advocate &amp; Legal Consultant
              </p>
              <p className="text-base text-slate-400 leading-relaxed max-w-xl mb-10">
                Specialising in Negotiable Instruments Act, Criminal &amp; Anticipatory Bail matters across the District Courts and High Court Division of Bangladesh.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact" className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/25 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  Book a Consultation <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#about" className="glass-dark text-white/80 hover:text-white px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-white/10 flex items-center justify-center gap-2">
                  Learn More <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center animate-slide-left">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl blur-2xl" />
                <img src="/advocate-portrait.png" alt="Advocate Abdul Karim" className="relative w-[380px] h-[460px] object-cover rounded-2xl shadow-premium-lg border border-white/10" />
                <div className="absolute -bottom-5 -left-5 glass-gold rounded-xl p-4 shadow-premium animate-float hidden xl:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Award className="w-5 h-5 text-amber-700" /></div>
                    <div><p className="text-sm font-bold text-slate-800">2,400+</p><p className="text-xs text-slate-500">Cases Handled</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-premium-lg">
                <img src="/advocate-working.png" alt="Advocate Karim in office" className="w-full h-[400px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 glass-gold rounded-xl p-5 shadow-premium animate-float hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-amber-700" /></div>
                  <div><p className="text-sm font-bold text-slate-800">Supreme Court</p><p className="text-xs text-slate-500">Licensed Advocate</p></div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
                <span className="text-xs text-amber-700 font-semibold">About the Advocate</span>
              </div>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                A Legacy of<br />Legal Excellence
              </h2>
              <div className="gold-accent-line mb-6" />
              <p className="text-slate-600 leading-relaxed mb-4">
                Advocate Abdul Karim is a distinguished legal professional with over 25 years of experience practising law in Bangladesh. Enrolled with the Bangladesh Bar Council, he has built an outstanding reputation for his expertise in handling complex NI Act (cheque dishonour) cases and criminal matters.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Based in Motijheel, Dhaka, his chambers serve clients from all major branches including Gulshan, Banani, and Dhanmondi. He is known for his meticulous case preparation, court-room command, and dedication to achieving the best outcomes for his clients.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "25+", label: "Years Experience" },
                  { value: "2,400+", label: "Cases Handled" },
                  { value: "15+", label: "Courts" },
                ].map(s => (
                  <div key={s.label} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRACTICE AREAS ══ */}
      <section id="practice" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs text-amber-700 font-semibold">Practice Areas</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Areas of Expertise</h2>
            <div className="gold-accent-line mx-auto mb-6" />
            <p className="text-slate-500">Comprehensive legal services across multiple domains of law.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Gavel, title: "NI Act Cases", desc: "Expert handling of cheque dishonour cases under the Negotiable Instruments Act, including cheque bounce complaints and recovery proceedings.", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
              { icon: ShieldCheck, title: "Criminal / ARA", desc: "Defence and prosecution in criminal matters including Anticipatory Bail, Regular Bail, and Appeal cases across district and sessions courts.", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
              { icon: Scale, title: "Civil Litigation", desc: "Representing clients in property disputes, contract enforcement, injunction proceedings, and declaratory suits in civil courts.", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
              { icon: FileText, title: "Documentation", desc: "Drafting and vetting of legal documents, affidavits, power of attorney, partnership deeds, and contract agreements.", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
              { icon: BookOpen, title: "High Court Division", desc: "Writ petitions, constitutional matters, and appellate litigation before the High Court Division of the Supreme Court of Bangladesh.", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100" },
              { icon: Clock, title: "Legal Consultation", desc: "Personalised legal advice sessions for individuals and businesses on corporate law, family matters, and regulatory compliance.", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
            ].map((s, i) => (
              <div key={s.title} className={`bg-white rounded-xl p-6 border ${s.border} card-hover shadow-sm animate-slide-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-5`}><s.icon className={`w-6 h-6 ${s.color}`} /></div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 font-serif-display">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCE / TIMELINE ══ */}
      <section id="experience" className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs text-amber-700 font-semibold">Career Journey</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Professional Timeline</h2>
            <div className="gold-accent-line mx-auto" />
          </div>
          <div className="space-y-0">
            {[
              { year: "2000", title: "Enrolled as Advocate", desc: "Enrolled with the Bangladesh Bar Council and started practising in Dhaka District Courts." },
              { year: "2006", title: "NI Act Specialisation", desc: "Developed expertise in Negotiable Instruments Act, handling over 500 cheque dishonour cases." },
              { year: "2012", title: "High Court Licence", desc: "Obtained licence to practise in the High Court Division of the Supreme Court of Bangladesh." },
              { year: "2018", title: "Multi-Branch Expansion", desc: "Expanded chambers to serve clients across Motijheel, Gulshan, Banani, and Dhanmondi." },
              { year: "2024", title: "Digital Transformation", desc: "Adopted Digital Chambers platform for modern case management and digital documentation." },
            ].map((item, i) => (
              <div key={item.year} className="flex gap-6 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">{item.year}</div>
                  {i < 4 && <div className="w-px h-full bg-slate-200 my-2" />}
                </div>
                <div className="pb-10">
                  <h3 className="text-base font-bold text-slate-800 font-serif-display">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/courtroom.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-premium opacity-90" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">Need Legal Assistance?</h2>
          <div className="gold-accent-line mx-auto mb-6" />
          <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10">Schedule a confidential consultation with Advocate Abdul Karim today.</p>
          <a href="#contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-10 py-4 rounded-lg text-base font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/25 hover:scale-105 active:scale-95">
            Contact Now <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs text-amber-700 font-semibold">Get In Touch</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Contact Chambers</h2>
            <div className="gold-accent-line mx-auto mb-6" />
            <p className="text-slate-500">Reach out for a consultation or enquiry. We are here to help.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Phone, label: "Phone", value: "+880 1XXXXXXXXX", sub: "Mon–Sat, 9 AM – 7 PM" },
              { icon: Mail, label: "Email", value: "karim@lawchambers.bd", sub: "We reply within 24 hours" },
              { icon: MapPin, label: "Chambers", value: "Motijheel, Dhaka", sub: "Bangladesh" },
            ].map(c => (
              <div key={c.label} className="text-center p-6 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-300 card-hover">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-4"><c.icon className="w-5 h-5 text-amber-400" /></div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{c.label}</h3>
                <p className="text-sm text-slate-700 font-medium">{c.value}</p>
                <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="gradient-premium text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-white/10"><Scale className="w-5 h-5 text-amber-400" strokeWidth={1.5} /></div>
                <span className="font-serif-display text-lg font-bold text-white">Advocate Abdul Karim</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">Senior Advocate &amp; Legal Consultant with 25+ years of distinguished practice across multiple courts in Bangladesh.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["About", "Practice", "Experience", "Contact"].map(l => (
                  <li key={l}><a href={`#${l.toLowerCase()}`} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Case Portal</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Login to Dashboard</Link></li>
                <li><span className="text-sm text-slate-500">Privacy Policy</span></li>
                <li><span className="text-sm text-slate-500">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="section-divider mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Law Chambers of Advocate Abdul Karim. All rights reserved.</p>
            <p>Motijheel, Dhaka, Bangladesh</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Sparkles, ArrowRight } from 'lucide-react';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeatureCard = ({ icon, title, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.3 }}
    className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/70">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
    <p className="text-slate-600">{children}</p>
  </motion.div>
);


export default function HomePage() {
  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-purple-200 rounded-full opacity-50 blur-3xl animate-blob"></div>
          <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-indigo-200 rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[10%] left-[20%] w-72 h-72 bg-pink-200 rounded-full opacity-50 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <header className="sticky top-4 z-50 mx-auto max-w-6xl">
        <nav className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl rounded-xl shadow-md border border-white/80">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-bold text-slate-900">Study Buddy</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="font-medium text-slate-600 hover:text-indigo-600 transition">Features</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="font-semibold text-slate-600 hover:text-indigo-600 transition">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="text-center pt-24 pb-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Turn Your Notes Into Knowledge
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10">
              Stop re-reading and start retaining. Upload your study materials and let our AI create summaries, interactive quizzes, and flashcards for you in seconds.
            </p>
            <Link to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-transform">
              Get Started for Free <ArrowRight size={20} />
            </Link>
          </motion.div>
        </section>

        <section id="features" className="py-24 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Study Smarter, Not Harder</h2>
            <p className="text-lg text-slate-600 text-center mb-16 max-w-2xl mx-auto">
              Our suite of AI-powered tools is designed to help you focus on what matters most: understanding and remembering.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard icon={<Sparkles size={24} />} title="AI-Powered Summaries">
                Get the key points from long documents instantly. Our AI reads your notes and provides concise summaries to save you time.
              </FeatureCard>
              <FeatureCard icon={<BookOpen size={24} />} title="Interactive Flashcards">
                Automatically generate question-and-answer flashcards from your materials to test your knowledge and reinforce learning.
              </FeatureCard>
              <FeatureCard icon={<Zap size={24} />} title="Dynamic Quizzes">
                Challenge yourself with custom quizzes created from your notes. Track your progress and identify areas for improvement.
              </FeatureCard>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-4 text-center">
        <div className="max-w-6xl mx-auto">
            <Logo />
            <p className="mt-4 text-slate-500">
              © {new Date().getFullYear()} Study Buddy. All rights reserved.
            </p>
        </div>
      </footer>
      
      {/* Simple CSS for the animation */}
      <style>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
}

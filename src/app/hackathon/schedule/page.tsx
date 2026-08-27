'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import { 
  Clock, 
  MapPin, 
  Flame, 
  Coffee, 
  Utensils, 
  Sparkles, 
  Users, 
  Video, 
  Code, 
  Presentation, 
  Award, 
  Moon, 
  Sun,
  Smile,
  Zap,
  Info
} from 'lucide-react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

// TYPES & SCHEMAS
interface ScheduleItemProps {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags?: string[];
  type?: 'masterclass' | 'activity' | 'general' | 'execution';
}

interface BreakItemProps {
  time: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
}

interface DayData {
  dayNumber: number;
  dateStr: string;
  themeTitle: string;
  focus: string;
  items: (
    | { type: 'item'; data: ScheduleItemProps }
    | { type: 'break'; data: BreakItemProps }
  )[];
}

const scheduleData: DayData[] = [
  {
    dayNumber: 1,
    dateStr: "Saturday, Oct 24",
    themeTitle: "DISCOVERY, IDEATION & BRANDING",
    focus: "Learning AI tools, building a startup idea, and creating all marketing assets.",
    items: [
      {
        type: 'item',
        data: {
          time: "09:30 AM - 10:30 AM",
          title: "Inauguration & Keynote",
          description: "Welcome speech by College Principal. Chief Guest address on 'The Future of AI in Engineering'. Setting the vision for prompt-driven innovation.",
          icon: <Sparkles className="w-5 h-5 text-teal-400" />,
          type: 'general',
          tags: ["Keynote", "Kickoff"]
        }
      },
      {
        type: 'item',
        data: {
          time: "10:30 AM - 11:00 AM",
          title: "Team Formation & Setup",
          description: "Finalize your team members, set up workspaces, and connect to the local network. Make sure your environment is fully primed.",
          icon: <Users className="w-5 h-5 text-teal-400" />,
          type: 'general',
          tags: ["Logistics", "Teams"]
        }
      },
      {
        type: 'item',
        data: {
          time: "11:00 AM - 12:30 PM",
          title: "Masterclass 1: LLMs & Prompt Engineering",
          description: "How Large Language Models actually work behind the scenes. Dive deep into the 'CREATE' framework for perfect prompting. Activity: Teams write their first 10 prompts to solve a real-world problem.",
          icon: <Zap className="w-5 h-5 text-teal-400" />,
          type: 'masterclass',
          tags: ["Masterclass", "LLMs", "CREATE Framework"]
        }
      },
      {
        type: 'break',
        data: {
          time: "12:30 PM - 02:00 PM",
          title: "LUNCH BREAK",
          description: "Time to fuel up! Head to the cafeteria. Informal discussions and networking over delicious lunch.",
          icon: <Utensils className="w-6 h-6 text-emerald-400" />
        }
      },
      {
        type: 'item',
        data: {
          time: "02:00 PM - 05:00 PM",
          title: "Masterclass 2: The Gen AI Arsenal & Startup Ideation",
          description: "Explore AI tools to construct your brand. Logos: Leonardo.ai, Midjourney, Canva Magic. Videos: Veo3, Luma Dream Machine, RunwayML. Posters: AI layout generation. Activity: Teams brainstorm their startup idea and define their target audience.",
          icon: <Video className="w-5 h-5 text-teal-400" />,
          type: 'masterclass',
          tags: ["Masterclass", "GenAI Tools", "Design", "Ideation"]
        }
      },
      {
        type: 'break',
        data: {
          time: "05:00 PM - 06:00 PM",
          title: "EVENING BREAK / SNACKS",
          description: "Grab a cup of warm coffee or tea and snacks. Stretch your legs and recharge your batteries.",
          icon: <Coffee className="w-6 h-6 text-emerald-400" />
        }
      },
      {
        type: 'item',
        data: {
          time: "06:00 PM - 08:00 PM",
          title: "Masterclass 3: API Keys & Vibe Coding Intro",
          description: "What is an API? Learn how to generate and secure free Gemini/OpenAI API keys. Learn Vibe Coding: Intro to Replit Agent, Lovable, and Bolt.new - how to build full-stack apps by just typing prompts.",
          icon: <Code className="w-5 h-5 text-teal-400" />,
          type: 'masterclass',
          tags: ["Masterclass", "APIs", "Vibe Coding", "NoCode/LowCode"]
        }
      },
      {
        type: 'break',
        data: {
          time: "08:00 PM - 10:00 PM",
          title: "DINNER & FRESHEN UP",
          description: "Refresh and join for a hearty dinner before the overnight sprints begin.",
          icon: <Utensils className="w-6 h-6 text-emerald-400" />
        }
      },
      {
        type: 'item',
        data: {
          time: "10:00 PM - 12:00 AM",
          title: "Masterclass 4: Idea Validation & Business Model",
          description: "How to know if your idea is actually good and viable. Creating a 1-page Business Model Canvas. Defining the core features of the app you will build tomorrow.",
          icon: <Presentation className="w-5 h-5 text-teal-400" />,
          type: 'masterclass',
          tags: ["Masterclass", "Business Canvas", "Validation"]
        }
      },
      {
        type: 'item',
        data: {
          time: "12:00 AM - 02:00 AM",
          title: "CAMPFIRE & NETWORKING",
          description: "Unwind under the stars with a warm bonfire, background music, and informal mentoring check-ins.",
          icon: <Flame className="w-5 h-5 text-orange-400" />,
          type: 'general',
          tags: ["Mentorship", "Social", "Campfire"]
        }
      },
      {
        type: 'item',
        data: {
          time: "02:00 AM - 06:00 AM",
          title: "THE BRANDING SPRINT",
          description: "Execution Phase 1 - No coding yet! Teams use this time to generate their startup identity: Generate the final AI Logo, Create a 30-second AI marketing video, Design the launch poster, Finalize the pitch deck.",
          icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
          type: 'execution',
          tags: ["Sprint", "Marketing Assets", "Branding Video"]
        }
      },
      {
        type: 'break',
        data: {
          time: "06:00 AM - 09:00 AM",
          title: "SLEEP / BREAKFAST / FRESHEN UP",
          description: "Mandatory rest period so everyone is energized for the build! Fuel up with breakfast afterwards.",
          icon: <Moon className="w-6 h-6 text-purple-400" />
        }
      }
    ]
  },
  {
    dayNumber: 2,
    dateStr: "Sunday, Oct 25",
    themeTitle: "BUILD, PITCH & WIN",
    focus: "Actually building the working product using Vibe Coding and presenting it.",
    items: [
      {
        type: 'item',
        data: {
          time: "09:00 AM - 12:30 PM",
          title: "VIBE CODING SPRINT",
          description: "Execution Phase 2 - Teams open Replit/Lovable/Bolt. Use your API keys to build the actual working UI and backend of your startup idea. Mentors rotate and help teams debug their AI prompts.",
          icon: <Code className="w-5 h-5 text-teal-400" />,
          type: 'execution',
          tags: ["Code Sprint", "Prototype Build", "Mentor Support"]
        }
      },
      {
        type: 'break',
        data: {
          time: "12:30 PM - 02:00 PM",
          title: "LUNCH BREAK",
          description: "The final lunch of the hackathon. Take a deep breath and polish your presentation slides.",
          icon: <Utensils className="w-6 h-6 text-emerald-400" />
        }
      },
      {
        type: 'item',
        data: {
          time: "02:00 PM - 05:00 PM",
          title: "Project Review, Q&A & Prize Distribution",
          description: "3 Minutes: Team pitches their startup idea, shows their branding video, and gives a LIVE DEMO of the app they just vibe-coded. 2 Minutes: Q&A from the judges. 04:30 PM: Winner announcement and Prize Distribution! 05:00 PM: Closing Ceremony & Group Photo.",
          icon: <Award className="w-5 h-5 text-yellow-400" />,
          type: 'general',
          tags: ["Pitches", "Demo Day", "Awards", "Ceremony"]
        }
      }
    ]
  }
];

// SUB-COMPONENTS
const ScheduleItem: React.FC<ScheduleItemProps> = ({ time, title, description, icon, tags, type }) => {
  // Styles based on item type
  const borderTealGlow = "hover:border-teal-500 hover:shadow-[0_0_20px_rgba(13,140,122,0.25)]";
  
  const typeStyles: Record<string, string> = {
    masterclass: "border-l-4 border-l-teal-500",
    execution: "border-l-4 border-l-indigo-500",
    general: "border-l-4 border-l-cyan-500",
    activity: "border-l-4 border-l-amber-500",
  };

  const activeBorder = type ? typeStyles[type] || "border-l-4 border-l-transparent" : "border-l-4 border-l-transparent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className={`relative group bg-[#111928]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 ${activeBorder} ${borderTealGlow}`}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Time and Icon Column */}
        <div className="flex items-center md:items-start gap-3 md:flex-col md:w-44 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 tracking-wide uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>{time.split(":")[0]}:{time.split(":")[1]}</span>
          </div>
          <div className="hidden md:flex p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:bg-teal-500/10 group-hover:border-teal-500/30 transition-all duration-300">
            {icon}
          </div>
        </div>

        {/* Text Details Column */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h4 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-teal-300 transition-colors duration-300 tracking-tight">
              {title}
            </h4>
          </div>
          <p className="text-sm md:text-base leading-relaxed text-slate-400">
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 text-2xs md:text-xs font-medium rounded-full bg-white/5 border border-white/10 text-slate-300 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const BreakItem: React.FC<BreakItemProps> = ({ time, title, description, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
      className="relative w-full bg-emerald-950/20 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
    >
      <div className="flex items-center gap-5">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs font-black text-emerald-400 tracking-wider uppercase">
              {time}
            </span>
            <span className="text-lg font-bold text-emerald-300 tracking-tight">
              {title}
            </span>
          </div>
          {description && (
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ScheduleDay: React.FC<{ day: DayData }> = ({ day }) => {
  return (
    <div className="space-y-12">
      {/* Day Overview Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#111928]/90 to-[#1f2937]/30 border border-white/10 rounded-3xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5" />
              Day {day.dayNumber} · {day.dateStr}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
              {day.themeTitle}
            </h3>
            <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
              <strong className="text-slate-200">Focus:</strong> {day.focus}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="relative">
        {/* Vertical Timeline Central Line (Hidden on Mobile) */}
        <div className="absolute left-[34px] md:left-[34px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-teal-500/30 via-slate-700/50 to-indigo-500/20 hidden md:block" />

        <div className="space-y-6">
          {day.items.map((item, idx) => {
            if (item.type === 'item') {
              return (
                <div key={idx} className="relative md:pl-20">
                  {/* Timeline bullet dot */}
                  <div className="absolute left-6 top-7 w-3.5 h-3.5 rounded-full bg-teal-400 border-[3px] border-[#0B1120] shadow-[0_0_10px_rgba(45,212,191,0.5)] z-10 hidden md:block" />
                  <ScheduleItem {...item.data} />
                </div>
              );
            } else {
              return (
                <div key={idx} className="relative md:pl-20">
                  {/* Timeline bullet dot */}
                  <div className="absolute left-6 top-7 w-3.5 h-3.5 rounded-full bg-emerald-400 border-[3px] border-[#0B1120] shadow-[0_0_10px_rgba(52,211,153,0.5)] z-10 hidden md:block" />
                  <BreakItem {...item.data} />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

// MAIN PAGE COMPONENT
export default function HackathonSchedulePage() {
  const [activeDay, setActiveDay] = useState<number>(1);
  const day1Ref = useRef<HTMLDivElement>(null);
  const day2Ref = useRef<HTMLDivElement>(null);

  // Smooth scroll helper
  const scrollToDay = (dayNum: number) => {
    setActiveDay(dayNum);
    const targetRef = dayNum === 1 ? day1Ref : day2Ref;
    if (targetRef.current) {
      const topOffset = 100; // offset for sticky nav
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Listen to scroll to update active pill
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      if (day2Ref.current) {
        const day2Top = day2Ref.current.offsetTop;
        if (scrollPos >= day2Top) {
          setActiveDay(2);
        } else {
          setActiveDay(1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-[#0B1120] text-slate-100 antialiased ${spaceGrotesk.variable} ${dmSans.variable} font-sans pb-24 overflow-x-hidden`}>
      
      {/* Decorative Gradient Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0D8C7A]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[140px]" />
      </div>

      {/* HEADER SECTION */}
      <header className="relative pt-20 pb-16 px-4 md:px-8 text-center max-w-5xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Logo / Subtitle Line */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-teal-400 tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 fill-teal-400/20 text-teal-400" />
            Hackathon Central
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-slate-100 font-display uppercase">
            <span className="text-teal-400">Path Pilot</span> Presents: <br />
            Prompt-to-Product
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl font-medium text-slate-300 tracking-tight max-w-2xl mx-auto">
            The 48-Hour GenAI & Vibe Coding Hackathon
          </p>

          {/* Theme Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm font-semibold shadow-[0_4px_20px_rgba(13,140,122,0.15)]">
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>Theme: From Zero to Startup in 48 Hours using AI</span>
          </div>
        </motion.div>
      </header>

      {/* STICKY DAY SELECTOR / TOGGLE NAVIGATION */}
      <nav className="sticky top-4 z-40 px-4 max-w-md mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between p-1.5 bg-[#0B1120]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          <button
            onClick={() => scrollToDay(1)}
            className={`flex-1 py-3 px-6 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
              activeDay === 1
                ? 'bg-teal-500 text-[#0B1120] shadow-[0_4px_14px_rgba(13,140,122,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Day 1
          </button>
          <button
            onClick={() => scrollToDay(2)}
            className={`flex-1 py-3 px-6 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
              activeDay === 2
                ? 'bg-teal-500 text-[#0B1120] shadow-[0_4px_14px_rgba(13,140,122,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Day 2
          </button>
        </motion.div>
      </nav>

      {/* TIMELINE SCHEDULE SECTIONS */}
      <main className="relative max-w-4xl mx-auto px-4 md:px-8 space-y-28 z-10">
        
        {/* DAY 1 SECTION */}
        <div ref={day1Ref} id="day-1" className="scroll-mt-28">
          <ScheduleDay day={scheduleData[0]} />
        </div>

        {/* DAY 2 SECTION */}
        <div ref={day2Ref} id="day-2" className="scroll-mt-28">
          <ScheduleDay day={scheduleData[1]} />
        </div>

      </main>

      {/* FOOTER INFO BAR */}
      <footer className="max-w-4xl mx-auto px-4 md:px-8 mt-24 text-center z-10 relative">
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md inline-flex items-center gap-3 text-xs md:text-sm text-slate-400">
          <Info className="w-5 h-5 text-teal-400 flex-shrink-0" />
          <span>All times are subject to slight adjustments based on hackathon sprint speeds. Maintain coordinates with your mentors.</span>
        </div>
      </footer>

    </div>
  );
}

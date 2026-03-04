import React, { useState, useRef, useEffect } from 'react';

const BOOT_TEXT = [
  "Microsoft(R) Windows 98",
  // "(C) Copyright Microsoft Corp 1981-1998.",
  "Sahil's Portfolio v1.0.4",
  "Type 'help' for a list of available commands.",
  ""
];

export default function TerminalApp() {
  const [history, setHistory] = useState<string[]>([...BOOT_TEXT]);
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll the terminal container to the bottom 
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [history]);

  // Focus the input 
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setHistory(prev => [...prev, `C:>${trimmed}`]);
      return;
    }

    setHistory(prev => [...prev, `C:>${trimmed}`, ""]);

    const command = trimmed.toLowerCase();
    let output: string | string[] = '';

    switch (command) {
      case 'help':
        output = [
          "Available Commands:",
          "",
          "help",
          "about",
          "skills",
          "projects",
          "experience",
          "contact",
          "github",
          "linkedin",
          "clear",
          "dir"
        ];
        break;
      case 'about':
        output = [
          "Sahil Kumar",
          "Full Stack Developer",
          "",
          "3+ years experience building web applications using:",
          "",
          "React",
          "Node.js",
          "TypeScript",
          "Generative AI"
        ];
        break;
      case 'skills':
        output = [
          "Frontend:",
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind",
          "",
          "Backend:",
          "Node.js",
          "Express",
          "MongoDB",
          "",
          "AI:",
          "OpenAI",
          "LangChain",
          "Prompt Engineering"
        ];
        break;
      case 'projects':
        output = [
          "1. Windows 98 Portfolio OS",
          "2. AI Job Scraper",
          "3. Multi-Agent AI Chat Platform",
          "",
          'Type "open project1" to learn more.'
        ];
        break;
      case 'experience':
        output = [
          "Software Developer",
          "3 years experience",
          "",
          "Specialized in:",
          "Frontend Architecture",
          "AI Integrations",
          "Interactive UI Systems"
        ];
        break;
      case 'contact':
        output = [
          "Email: sahil@example.com",
          "GitHub: github.com/sahil",
          "LinkedIn: linkedin.com/in/sahil"
        ];
        break;
      case 'github':
        window.open("https://github.com/sahilkumarsahoo07", "_blank");
        output = "Opening GitHub...";
        break;
      case 'linkedin':
        window.open("https://in.linkedin.com/in/sahil-kumar-sahoo", "_blank");
        output = "Opening LinkedIn...";
        break;
      case 'dir':
        output = [
          "Volume in drive C has no label.",
          "Directory of C:\\",
          "",
          "ABOUT.TXT",
          "PROJECTS.TXT",
          "SKILLS.TXT",
          "CONTACT.TXT"
        ];
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        output = "Bad command or file name.";
    }

    if (output) {
      const outputLines = Array.isArray(output) ? output : output.split('\n');
      setHistory(prev => [...prev, ...outputLines, ""]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div
      ref={containerRef}
      className="p-2 h-full bg-black font-mono text-[14px] sm:text-base text-[#c0c0c0] overflow-y-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="whitespace-pre-wrap leading-tight">
        {history.map((line, i) => (
          <div key={i} className="min-h-[1em]">{line}</div>
        ))}
      </div>
      <div className="flex leading-tight">
        <span className="mr-2">C:{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck="false"
          className="flex-1 bg-transparent outline-none text-[#c0c0c0] font-mono shadow-none focus:ring-0 p-0 m-0 border-none caret-[#c0c0c0]"
        />
      </div>
    </div>
  );
}

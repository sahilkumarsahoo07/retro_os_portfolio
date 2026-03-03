import React, { useState, useRef, useEffect } from 'react';

export default function TerminalApp() {
  const [history, setHistory] = useState([
    "SYNTH_TERM v1.0.4",
    "Type 'help' for a list of available commands."
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    
    setHistory(prev => [...prev, `> ${trimmed}`]);
    
    const parts = trimmed.toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    let output = '';
    
    switch (command) {
      case 'help':
        output = "Available commands: \n- help\n- clear\n- echo [text]\n- whoami\n- date\n- matrix";
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'echo':
        output = args.join(' ');
        break;
      case 'whoami':
        output = "guest_user_99";
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'matrix':
        output = "Wake up, Neo... \nThe Matrix has you... \nFollow the white rabbit.";
        break;
      case 'sudo':
        output = "NICE TRY. Incident logged.";
        break;
      default:
        output = `Command not found: ${command}`;
    }

    if (output) {
      setHistory(prev => [...prev, ...output.split('\n')]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="p-4 h-full bg-black font-body text-xl text-green-500 overflow-y-auto crt-flicker">
      <div className="whitespace-pre-wrap">
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="flex mt-2">
        <span className="mr-2">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none text-green-500 font-body shadow-none focus:ring-0"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

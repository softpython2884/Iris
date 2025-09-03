"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const welcomeMessage = [
  '██╗ ██████╗ ██╗███████╗',
  '██║ ██╔══██╗██║██╔════╝',
  '██║ ██████╔╝██║███████╗',
  '██║ ██╔══██╗██║╚════██║',
  '██║ ██║  ██║██║███████║',
  '╚═╝ ╚═╝  ╚═╝╚═╝╚══════╝',
  'IRIS Sub-System v0.1.0 Initialized.',
  'STATUS: OPERATIONAL. Awaiting command...',
  'Type "help" for a list of available commands.',
  '',
];

export function TerminalOutput() {
  const [lines, setLines] = useState<string[]>(welcomeMessage);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      const newLines = [...lines, `> ${command}`];
      
      if (command === 'help') {
        newLines.push('Available commands: help, clear, status');
      } else if (command === 'clear') {
        setLines([]);
        setInput('');
        return;
      } else if (command === 'status') {
         newLines.push('System status: All systems nominal.');
         newLines.push('Connection: SECURE_NODE_7');
         newLines.push('Active bots: 2');
      } else if (command) {
        newLines.push(`Unknown command: ${command}`);
      }

      setLines(newLines);
      setInput('');
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <Card className="flex-1 flex flex-col border-primary/50 bg-primary/10 h-full">
      <CardContent className="flex-1 overflow-auto p-4 font-mono text-sm text-green-400 flex flex-col">
        <div className="flex-grow">
          {lines.map((line, index) => (
            <pre key={index} className="whitespace-pre-wrap">{line}</pre>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        <div className="flex items-center">
          <span className="text-accent mr-2">{'>'}</span>
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="w-full bg-transparent border-none text-green-400 focus:ring-0 p-0 h-6"
            autoFocus
            autoComplete="off"
          />
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
}

const ChatInput = ({ value, onChange, onSend, isLoading = false }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك هنا..."
          className="flex-grow px-4 py-3 outline-none resize-none max-h-[200px] min-h-[56px]"
          rows={1}
          dir="auto"
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !value.trim()}
          className={`p-3 ${
            value.trim() && !isLoading ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
          } hover:opacity-90 transition-colors`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        AD PLUS Assistant - يقدم معلومات عن الخدمات المتاحة في أبوظبي
      </p>
    </div>
  );
};

export default ChatInput;

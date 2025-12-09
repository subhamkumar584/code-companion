import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { FileExplorer } from "@/components/chat/FileExplorer";
import { CodeViewer } from "@/components/code/CodeViewer";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Mock file structure
const mockFiles = [
  {
    name: "src",
    type: "folder" as const,
    path: "src",
    children: [
      {
        name: "components",
        type: "folder" as const,
        path: "src/components",
        children: [
          { name: "Button.tsx", type: "file" as const, path: "src/components/Button.tsx" },
          { name: "Card.tsx", type: "file" as const, path: "src/components/Card.tsx" },
          { name: "Modal.tsx", type: "file" as const, path: "src/components/Modal.tsx" },
        ],
      },
      {
        name: "hooks",
        type: "folder" as const,
        path: "src/hooks",
        children: [
          { name: "useAuth.ts", type: "file" as const, path: "src/hooks/useAuth.ts" },
          { name: "useApi.ts", type: "file" as const, path: "src/hooks/useApi.ts" },
        ],
      },
      { name: "App.tsx", type: "file" as const, path: "src/App.tsx" },
      { name: "index.tsx", type: "file" as const, path: "src/index.tsx" },
    ],
  },
  { name: "package.json", type: "file" as const, path: "package.json" },
  { name: "README.md", type: "file" as const, path: "README.md" },
];

const mockCode = `import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors focus:outline-none focus:ring-2',
        variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
        variant === 'secondary' && 'bg-secondary text-foreground hover:bg-secondary/80',
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
        size === 'sm' && 'h-8 px-3 text-sm',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-12 px-6 text-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}`;

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I've analyzed your repository. Ask me anything about your codebase - from understanding specific functions to architectural decisions.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [codeViewerOpen, setCodeViewerOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState({ name: "", code: "" });

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Based on your question about "${content.slice(0, 50)}...", I found the following in your codebase:\n\nThe relevant code is located in the \`src/components\` directory. The main component handles this functionality through a custom hook that manages state and side effects.\n\nWould you like me to explain the specific implementation details?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    setViewingFile({ name: path.split("/").pop() || path, code: mockCode });
    setCodeViewerOpen(true);
  };

  return (
    <MainLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-semibold text-foreground">Chat with your code</h1>
            <p className="text-sm text-muted-foreground">my-project.zip</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFileExplorer(!showFileExplorer)}
            className="hidden lg:flex"
          >
            {showFileExplorer ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5" />
            )}
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer */}
          {showFileExplorer && (
            <aside className="hidden lg:block w-72 border-r border-border shrink-0">
              <FileExplorer
                files={mockFiles}
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
              />
            </aside>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <ChatInput
                onSend={handleSend}
                onAttach={() => setShowFileExplorer(true)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Code Viewer Modal */}
      <CodeViewer
        isOpen={codeViewerOpen}
        onClose={() => setCodeViewerOpen(false)}
        fileName={viewingFile.name}
        code={viewingFile.code}
      />
    </MainLayout>
  );
}

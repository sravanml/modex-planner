import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Layout/Navbar";
import { ModuleSelector } from "@/components/Layout/ModuleSelector";
import { 
  MessageSquare, 
  Send,
  Upload,
  Download,
  Image as ImageIcon,
  Bot,
  User,
  Sparkles,
  FileText,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  hasFile?: boolean;
  fileName?: string;
}

interface ChatSession {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
}

const Experimentation = () => {
  const [selectedModule, setSelectedModule] = useState("planning-forecasting");
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to the AI Experimentation Lab! I\'m ModEx AI, your advanced supply chain assistant. I can help you with predictive modeling, scenario analysis, and complex supply chain optimization. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [chatSessions] = useState<ChatSession[]>([
    {
      id: 'session_1',
      name: 'Demand Forecasting Analysis',
      lastMessage: 'Can you explain the seasonal patterns...',
      timestamp: '2 hours ago'
    },
    {
      id: 'session_2', 
      name: 'Supply Chain Optimization',
      lastMessage: 'What are the key bottlenecks in...',
      timestamp: '1 day ago'
    },
    {
      id: 'session_3',
      name: 'Risk Assessment Discussion',
      lastMessage: 'How should we handle supplier...',
      timestamp: '3 days ago'
    }
  ]);

  const { toast } = useToast();

  const handleModuleSelect = (moduleId: string, subModule?: string) => {
    setSelectedModule(moduleId);
    if (subModule) {
      toast({
        title: "Module Selected",
        description: `Switched to ${subModule}`,
      });
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Based on your query about "${currentMessage.slice(0, 30)}${currentMessage.length > 30 ? '...' : ''}", I can provide detailed analysis. Let me process your supply chain data and generate insights. Would you like me to create a predictive model or perform scenario analysis for your specific requirements?`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString(),
        hasFile: true,
        fileName: file.name
      };
      
      setChatMessages(prev => [...prev, fileMessage]);
      
      // Simulate AI file analysis
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I've analyzed your uploaded file "${file.name}". The data shows interesting patterns in your supply chain metrics. I can generate predictions based on this data. Would you like me to create a forecast model or perform specific analysis?`,
          timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 2000);

      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded and analyzed by AI`,
      });
    }
  };

  const handleDownloadPrediction = () => {
    toast({
      title: "Download Started",
      description: "AI prediction file is being prepared for download",
    });
  };

  const suggestedPrompts = [
    "Analyze demand patterns for Q2 2024",
    "What are the main supply chain risks?", 
    "Optimize inventory levels for peak season",
    "Create a scenario analysis for supplier disruption"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Module Selection Section */}
        <ModuleSelector 
          selectedModule={selectedModule}
          onModuleSelect={handleModuleSelect}
          currentStep="experimentation"
        />

        {/* Main Content */}
        <div className="mt-8">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-primary rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">AI Experimentation Lab</h1>
                    <p className="text-muted-foreground">
                      Advanced AI-powered supply chain analysis and prediction workspace
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Chat History Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="h-[700px]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <History className="h-5 w-5" />
                        <span>Chat History</span>
                      </CardTitle>
                      <CardDescription>Previous AI conversations</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-2 p-4">
                        <Button className="w-full justify-start bg-gradient-primary hover:opacity-90">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          New Conversation
                        </Button>
                        
                        {chatSessions.map((session) => (
                          <div 
                            key={session.id} 
                            className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          >
                            <h4 className="font-medium text-sm mb-1">{session.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {session.lastMessage}
                            </p>
                            <span className="text-xs text-muted-foreground">{session.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Chat Interface */}
                <div className="lg:col-span-3">
                  <Card className="h-[700px] flex flex-col">
                    <CardHeader className="border-b bg-gradient-hero text-white">
                      <CardTitle className="flex items-center space-x-2">
                        <Bot className="h-6 w-6" />
                        <span>ModEx AI - Advanced Analytics</span>
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        Upload data, ask complex questions, and get AI-powered insights
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col p-0">
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {chatMessages.map((message) => (
                          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                message.type === 'user' 
                                  ? 'bg-primary text-primary-foreground ml-3' 
                                  : 'bg-accent text-accent-foreground mr-3'
                              }`}>
                                {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                              </div>
                              <div className={`rounded-lg px-4 py-3 ${
                                message.type === 'user' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                {message.hasFile && (
                                  <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-current/20">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-xs">{message.fileName}</span>
                                  </div>
                                )}
                                <span className="text-xs opacity-70 mt-2 block">{message.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Suggested Prompts */}
                      <div className="border-t p-4">
                        <p className="text-sm font-medium mb-3">Try asking:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {suggestedPrompts.map((prompt, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-2 px-3 justify-start"
                              onClick={() => setCurrentMessage(prompt)}
                            >
                              {prompt}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* File Upload & Actions */}
                      <div className="border-t p-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Files
                              </span>
                            </Button>
                          </Label>
                          <Input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".csv,.xlsx,.json,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          
                          <Button variant="outline" size="sm">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Add Image
                          </Button>
                          
                          <Button variant="outline" size="sm" onClick={handleDownloadPrediction}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {/* Message Input */}
                      <div className="border-t p-4">
                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="Ask ModEx AI anything about your supply chain data, predictions, or scenarios..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            className="resize-none flex-1"
                            rows={3}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button 
                            onClick={handleSendMessage} 
                            className="self-end bg-gradient-primary hover:opacity-90"
                            disabled={!currentMessage.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Press Enter to send, Shift+Enter for new line
                        </p>
                      </div>
                    </CardContent>
                   </Card>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default Experimentation;
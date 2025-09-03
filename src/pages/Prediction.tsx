import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Play, 
  Calendar, 
  MapPin, 
  FileText, 
  Download,
  MessageSquare,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  History,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModelRun {
  id: string;
  dateRange: string;
  region: string;
  status: 'in-progress' | 'success' | 'failed';
  progress: number;
  createdAt: string;
}

const Prediction = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [region, setRegion] = useState("");
  const [modelRuns, setModelRuns] = useState<ModelRun[]>([
    {
      id: 'run_001',
      dateRange: '2024-01-01 to 2024-03-31',
      region: 'North America',
      status: 'success',
      progress: 100,
      createdAt: '2024-01-15 14:30'
    },
    {
      id: 'run_002',
      dateRange: '2024-04-01 to 2024-06-30',
      region: 'Europe',
      status: 'in-progress',
      progress: 67,
      createdAt: '2024-01-16 09:15'
    }
  ]);
  const [selectedRun, setSelectedRun] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: "Hello! I'm ModEx AI. I can help you understand your supply chain predictions and answer questions about model results. How can I assist you today?",
      timestamp: '2024-01-16 09:00:00'
    },
    {
      type: 'user',
      message: 'What are the key factors driving the forecast for Widget A?',
      timestamp: '2024-01-16 09:05:00'
    },
    {
      type: 'ai',
      message: 'Based on your selected model run, the key factors driving Widget A forecast include: 1) Seasonal demand patterns showing 15% increase in Q2, 2) Regional market expansion in North America, 3) Historical sales data indicating strong correlation with economic indicators. The model confidence level is 87%.',
      timestamp: '2024-01-16 09:05:30'
    },
    {
      type: 'user',
      message: 'How accurate has this prediction model been historically?',
      timestamp: '2024-01-16 09:10:00'
    },
    {
      type: 'ai',
      message: 'The model has shown strong historical performance with an average accuracy of 94.2% over the past 12 months. For Widget A specifically, the accuracy rate is 91.5%. The model performs best during stable market conditions and may have reduced accuracy during supply chain disruptions.',
      timestamp: '2024-01-16 09:10:45'
    },
    {
      type: 'user',
      message: 'What risks should I consider for the upcoming quarter?',
      timestamp: '2024-01-16 09:15:00'
    },
    {
      type: 'ai',
      message: 'Key risks for the upcoming quarter include: 1) Supply chain bottlenecks in raw material procurement, 2) Potential demand volatility due to economic uncertainty, 3) Seasonal inventory buildup requirements, 4) Transportation cost fluctuations. I recommend maintaining safety stock levels at 15% above normal and monitoring supplier lead times closely.',
      timestamp: '2024-01-16 09:16:00'
    }
  ]);
  const [chatSessions] = useState([
    {
      id: 'session_1',
      name: 'Widget A Demand Forecast Analysis',
      lastMessage: 'What are the key factors driving the forecast...',
      timestamp: '2 hours ago'
    },
    {
      id: 'session_2',
      name: 'Model Accuracy Discussion',
      lastMessage: 'How accurate has this prediction model...',
      timestamp: '4 hours ago'
    },
    {
      id: 'session_3',
      name: 'Risk Assessment Q2 2024',
      lastMessage: 'What risks should I consider for the...',
      timestamp: '1 day ago'
    },
    {
      id: 'session_4',
      name: 'Seasonal Patterns Analysis',
      lastMessage: 'Can you explain the seasonal trends...',
      timestamp: '2 days ago'
    },
    {
      id: 'session_5',
      name: 'Supply Chain Disruption Impact',
      lastMessage: 'How will the supplier delays affect...',
      timestamp: '3 days ago'
    }
  ]);
  const [showChatHistory, setShowChatHistory] = useState(false);

  const { toast } = useToast();

  const handleGeneratePredictions = () => {
    if (!fromDate || !toDate || !region) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newRun: ModelRun = {
      id: `run_${Date.now()}`,
      dateRange: `${fromDate} to ${toDate}`,
      region: region,
      status: 'in-progress',
      progress: 0,
      createdAt: new Date().toLocaleString()
    };

    setModelRuns(prev => [newRun, ...prev]);

    // Simulate model execution progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        setModelRuns(prev => 
          prev.map(run => 
            run.id === newRun.id 
              ? { ...run, status: 'success', progress: 100 } 
              : run
          )
        );
        clearInterval(interval);
        toast({
          title: "Predictions Generated",
          description: "Model execution completed successfully",
        });
      } else {
        setModelRuns(prev => 
          prev.map(run => 
            run.id === newRun.id 
              ? { ...run, progress } 
              : run
          )
        );
      }
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatHistory(prev => [...prev, {
      type: 'user',
      message: chatMessage,
      timestamp: new Date().toISOString()
    }]);

    // Simulate AI response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: 'Based on your selected model run, I can see that the demand forecast shows a 15% increase in Q2. The model confidence level is 87%. Would you like me to explain the key factors driving this prediction?',
        timestamp: new Date().toISOString()
      }]);
    }, 1500);

    setChatMessage("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-warning animate-pulse" />;
      default:
        return null;
    }
  };

  const sampleQuestions = [
    "What are the key factors driving the forecast?",
    "How accurate is this prediction model?",
    "What risks should I consider?",
    "Can you explain the seasonal trends?"
  ];

  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold mb-2">Prediction & Output Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Generate ML-powered predictions and analyze results with ModEx AI
        </p>
      </div>

      {/* Initiate Model Run - Full Width */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm font-bold">
            <BarChart3 className="h-5 w-5" />
            <span>Generate Predictions</span>
          </CardTitle>
          <CardDescription>
            Set parameters for prediction generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-date">From Date</Label>
              <Input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-date">To Date</Label>
              <Input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  <SelectItem value="latin-america">Latin America</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Input Files</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="demand-data" 
                    className="rounded border-border"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles([...selectedFiles, "demand_data"]);
                      } else {
                        setSelectedFiles(selectedFiles.filter(f => f !== "demand_data"));
                      }
                    }}
                  />
                  <Label htmlFor="demand-data" className="text-xs cursor-pointer">
                    demand_data_2024.csv
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="inventory-levels" 
                    className="rounded border-border"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles([...selectedFiles, "inventory_levels"]);
                      } else {
                        setSelectedFiles(selectedFiles.filter(f => f !== "inventory_levels"));
                      }
                    }}
                  />
                  <Label htmlFor="inventory-levels" className="text-xs cursor-pointer">
                    inventory_levels.xlsx
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <Button 
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={handleGeneratePredictions}
              >
                <Play className="h-4 w-4 mr-2" />
                Run Model
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section - ModEx AI and Model Runs Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ModEx AI Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[500px] flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-gradient-primary text-white rounded-t-lg flex-shrink-0">
              <CardTitle className="flex items-center justify-between text-sm font-bold">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>ModEx AI - Your Supply Chain Assistant</span>
                </div>
                <Dialog open={showChatHistory} onOpenChange={setShowChatHistory}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <History className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[400px] overflow-hidden">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <History className="h-5 w-5" />
                        <span>Chat History</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto flex-1 space-y-3 pr-2 max-h-[300px]">
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
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription className="text-white/80">
                Ask questions about your predictions and get intelligent insights
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 break-words ${
                      chat.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{chat.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Questions */}
              <div className="border-t p-4 bg-muted/50 flex-shrink-0">
                <p className="text-sm font-medium mb-3">Suggested Questions:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 px-3 text-left justify-start whitespace-normal"
                      onClick={() => setChatMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="border-t p-4 flex-shrink-0">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask ModEx AI about your predictions..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <Button onClick={handleSendMessage} className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Runs */}
        <div className="lg:col-span-1">
          <Card className="h-[500px]">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Model Runs</CardTitle>
              <CardDescription>Track prediction generation progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
              {modelRuns.map((run) => (
                <div key={run.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{run.id}</span>
                    {getStatusIcon(run.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {run.dateRange}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {run.region}
                  </p>
                  {run.status === 'in-progress' && (
                    <Progress value={run.progress} className="mb-2" />
                  )}
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Prediction;
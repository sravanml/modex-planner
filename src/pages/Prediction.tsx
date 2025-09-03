import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  Send
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
      message: 'Hello! I\'m ModEx AI. I can help you understand your supply chain predictions and answer questions about model results. How can I assist you today?'
    }
  ]);

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
      message: chatMessage
    }]);

    // Simulate AI response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: 'Based on your selected model run, I can see that the demand forecast shows a 15% increase in Q2. The model confidence level is 87%. Would you like me to explain the key factors driving this prediction?'
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-bold">
                        <BarChart3 className="h-5 w-5" />
                        <span>Model Configuration</span>
                      </CardTitle>
                      <CardDescription>
                        Set parameters for prediction generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select files" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="demand_data">demand_data_2024.csv</SelectItem>
                            <SelectItem value="inventory_levels">inventory_levels.xlsx</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        className="w-full bg-gradient-primary hover:opacity-90"
                        onClick={handleGeneratePredictions}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Generate Predictions
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Model Runs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Model Runs</CardTitle>
                      <CardDescription>Track prediction generation progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {modelRuns.map((run) => (
                        <div key={run.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{run.id}</span>
                            {getStatusIcon(run.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {run.dateRange} • {run.region}
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

        {/* ModEx AI Chat Interface */}
        <div className="lg:col-span-2">
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="border-b bg-gradient-primary text-white rounded-t-lg">
                      <CardTitle className="flex items-center space-x-2 text-sm font-bold">
                        <MessageSquare className="h-5 w-5" />
                        <span>ModEx AI - Your Supply Chain Assistant</span>
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        Ask questions about your predictions and get intelligent insights
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col p-0">
                      {/* Chat History */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatHistory.map((chat, index) => (
                          <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              chat.type === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              <p className="text-sm">{chat.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Sample Questions */}
                      <div className="border-t p-4">
                        <p className="text-sm font-medium mb-3">Suggested Questions:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {sampleQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-2 px-3"
                              onClick={() => setChatMessage(question)}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Chat Input */}
                      <div className="border-t p-4">
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
      </div>
    </>
  );
};

export default Prediction;
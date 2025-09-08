import { useState, useEffect } from "react";
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
  FileText,
  Download,
  MessageSquare,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  History,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModelRun {
  id: string;
  run_id: string;
  date_range: string;
  region: string;
  files?: string;
  status: "in-progress" | "success" | "failed";
  progress: number;
  created_at: string;
  results_url?: string | null;
}

interface UploadedFile {
  id: string;
  filename: string;
}

const Prediction = () => {
  const [availableFiles, setAvailableFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [region, setRegion] = useState("");
  const [modelRuns, setModelRuns] = useState<ModelRun[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showChatHistory, setShowChatHistory] = useState(false);

  const { toast } = useToast();
  const userId = "test-user-123";
  const runId = "";

  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/get-data?user_id=${userId}&run_id=run-001`
      );
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();

      const mapped: UploadedFile[] = (data.records || []).map((row: any) => ({
        id: row.id?.toString() || row.filename,
        filename: row.filename,
      }));
      setAvailableFiles(mapped);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const fetchPredictions = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/get-predictions?user_id=${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch predictions");
      const data = await res.json();
      setModelRuns(data.records || []);
    } catch (err) {
      console.error("Error fetching predictions:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGeneratePredictions = async () => {
    if (!fromDate || !toDate || !region || selectedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select at least one file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("run_id", runId);
      formData.append("from_date", fromDate);
      formData.append("to_date", toDate);
      formData.append("region", region);
      formData.append("files", selectedFiles.join(","));

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction request failed");
      const result = await response.json();

      if (result.prediction) {
        setModelRuns((prev) => [result.prediction, ...prev]);
        toast({
          title: "Prediction Started",
          description: "Your model run has been queued.",
        });
      }
    } catch (err) {
      console.error("Error creating prediction:", err);
      toast({
        title: "Prediction Failed",
        description: "Could not create a new prediction run.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRun = async (run_id: string) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/delete-prediction?user_id=${userId}&run_id=${run_id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete run");

      setModelRuns((prev) => prev.filter((r) => r.run_id !== run_id));
      toast({
        title: "Deleted",
        description: `Run ${run_id} has been deleted.`,
      });
    } catch (err) {
      console.error("Error deleting run:", err);
      toast({
        title: "Delete Failed",
        description: "Could not delete the run.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCSV = (run: ModelRun) => {
    if (!run) return;
    const headers = ["Run ID", "Date Range", "Region", "Files", "Status", "Progress"];
    const row = [
      run.run_id,
      run.date_range,
      run.region,
      run.files || "",
      run.status,
      run.progress.toString(),
    ];
    const csvContent = [headers, row].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${run.run_id}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { type: "user", message: chatMessage, timestamp: new Date().toISOString() },
    ]);

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message:
            "Based on your selected model run, the demand forecast shows a 15% increase in Q2. Confidence: 87%.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 1500);

    setChatMessage("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-warning animate-pulse" />;
      default:
        return null;
    }
  };

  const sampleQuestions = [
    "What are the key factors driving the forecast?",
    "How accurate is this prediction model?",
  ];

  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold mb-2">Prediction & Output Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Generate ML-powered predictions and analyze results with ModEx AI
        </p>
      </div>

      {/* Generate Predictions Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm font-bold">
            <BarChart3 className="h-5 w-5" />
            <span>Generate Predictions</span>
          </CardTitle>
          <CardDescription>Set parameters for prediction generation</CardDescription>
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

            {/* Dynamic Input Files Section */}
            <div className="space-y-2">
              <Label>Input Files</Label>
              <div className="space-y-2">
                {availableFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No files uploaded yet.</p>
                ) : (
                  availableFiles.map((file) => (
                    <div key={file.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`file-${file.id}`}
                        className="rounded border-border"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles([...selectedFiles, file.filename]);
                          } else {
                            setSelectedFiles(
                              selectedFiles.filter((f) => f !== file.filename)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`file-${file.id}`} className="text-xs cursor-pointer">
                        {file.filename}
                      </Label>
                    </div>
                  ))
                )}
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

      {/* Chat + Model Runs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat */}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
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
                      <p className="text-xs text-muted-foreground">
                        (Future: load previous chats from backend)
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription className="text-white/80">
                Ask questions about your predictions and get intelligent insights
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 break-words ${
                        chat.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {chat.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested Qs */}
              <div className="border-t p-3 bg-muted/50 flex-shrink-0">
                <p className="text-sm font-medium mb-2">Suggested Questions:</p>
                <div className="flex gap-2">
                  {sampleQuestions.map((q, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 px-3 text-left justify-start whitespace-normal flex-1"
                      onClick={() => setChatMessage(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
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
          <Card className="h-[500px] flex flex-col overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Model Runs</CardTitle>
              <CardDescription>Track prediction generation progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
              {modelRuns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No model runs yet.</p>
              ) : (
                modelRuns.map((run) => (
                  <div key={run.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{run.run_id}</span>
                      {getStatusIcon(run.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {run.date_range}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {run.region}
                    </p>
                    {run.files && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Files: {run.files}
                      </p>
                    )}
                    {run.status === "in-progress" && (
                      <Progress value={run.progress} className="mb-2" />
                    )}
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={run.status !== "success"}
                        onClick={() => handleDownloadCSV(run)}
                      >
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                      <Button variant="ghost" size="sm" disabled>
                        <FileText className="h-3 w-3 mr-1" /> Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRun(run.run_id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Prediction;

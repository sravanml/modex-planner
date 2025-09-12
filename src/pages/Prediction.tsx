import { useState, useEffect, useMemo } from "react";
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
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModelRun {
  id: string;
  run_id: string;
  date_range: string | null;
  region: string | null;
  files?: string | null;
  status: "in-progress" | "success" | "failed" | "trained";
  progress: number;
  created_at: string;
  results_url?: string | null;
}

interface UploadedFile {
  id: string;
  filename: string;
}

const API_BASE = "http://127.0.0.1:8000";

const Prediction = () => {
  const [availableFiles, setAvailableFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [region, setRegion] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [modelRuns, setModelRuns] = useState<ModelRun[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const { toast } = useToast();
  const userId = "test-user-123"; // TODO: wire Supabase Auth

  const dataInputRunId = "run-001";

  const runIdPreview = useMemo(() => {
    const now = new Date();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");
    const yy = String(now.getUTCFullYear()).slice(-2);
    return `run_${mm}_${dd}_${yy}`;
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/get-data?user_id=${encodeURIComponent(userId)}&run_id=${encodeURIComponent(
          dataInputRunId
        )}`
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

  const fetchRegions = async () => {
    try {
      const res = await fetch(`${API_BASE}/get-regions?user_id=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error("Failed to fetch regions");
      const data = await res.json();
      setRegions(Array.isArray(data.regions) ? data.regions : []);
    } catch (err) {
      console.error("Error fetching regions:", err);
    }
  };

  const fetchPredictions = async () => {
    try {
      const res = await fetch(`${API_BASE}/get-predictions?user_id=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error("Failed to fetch predictions");
      const data = await res.json();
      setModelRuns(Array.isArray(data.records) ? data.records : []);
    } catch (err) {
      console.error("Error fetching predictions:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchRegions();
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGeneratePredictions = async () => {
    if (!fromDate || !toDate || !region || selectedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and select at least one file.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("run_id", "");
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("region", region);
    formData.append("files", selectedFiles.join(","));

    try {
      const res = await fetch(`${API_BASE}/predict`, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data?.detail || data?.message || "Prediction request failed");
      }

      if (data.prediction) {
        setModelRuns((prev) => [data.prediction, ...prev]);
      }

      toast({ title: "Prediction Started", description: "Your model run has been queued." });
    } catch (err: any) {
      console.error("Error creating prediction:", err);
      toast({
        title: "Prediction Failed",
        description: err?.message || "Could not create a new prediction run.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRun = async (run_id: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/delete-prediction?user_id=${encodeURIComponent(
          userId
        )}&run_id=${encodeURIComponent(run_id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data?.detail || data?.message || "Delete failed");
      }
      setModelRuns((prev) => prev.filter((r) => r.run_id !== run_id));
      toast({ title: "Deleted", description: `Run ${run_id} has been removed.` });
    } catch (err: any) {
      console.error("Error deleting run:", err);
      toast({
        title: "Delete Failed",
        description: err?.message || "Could not delete the run.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "trained":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-warning animate-pulse" />;
      default:
        return null;
    }
  };

  // ---- CHAT (calls backend /chat) ----
  const latestSuccessRun = useMemo(
    () => modelRuns.find((r) => r.status === "success")?.run_id,
    [modelRuns]
  );

  const handleSendMessage = async () => {
    const msg = chatMessage.trim();
    if (!msg) return;

    setChatHistory((prev) => [...prev, { type: "user", message: msg, timestamp: new Date().toISOString() }]);
    setChatMessage("");
    setChatLoading(true);

    try {
      const fd = new FormData();
      fd.append("user_id", userId);
      fd.append("message", msg);
      if (latestSuccessRun) fd.append("run_id", latestSuccessRun);

      const res = await fetch(`${API_BASE}/chat`, { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data?.detail || data?.message || "Chat failed");
      }

      const prettyTable =
        Array.isArray(data.preview) && data.preview.length
          ? "\n\n" +
            data.columns.join(" | ") +
            "\n" +
            data.preview
              .map((r: any) => data.columns.map((c: string) => String(r[c])).join(" | "))
              .join("\n")
          : "";

      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message: `${data.answer}${prettyTable}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message:
            "I couldn't analyze that just now. Please make sure a prediction has completed and try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold mb-2">Prediction & Output Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Generate predictions from your uploaded data and analyze results with ModEx AI.
        </p>
      </div>

      {/* Generate Predictions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm font-bold">
            <BarChart3 className="h-5 w-5" />
            <span>Generate Predictions</span>
          </CardTitle>
          <CardDescription>Pick files from the Data Input tab and set parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-date">From Date</Label>
              <Input id="from-date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-date">To Date</Label>
              <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            {/* Region dropdown (dynamic) */}
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.length === 0 ? (
                    <SelectItem value="default" disabled>
                      No regions available
                    </SelectItem>
                  ) : (
                    regions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Input Files */}
            <div className="space-y-2 md:col-span-2">
              <Label>Input Files (from Data Input: {dataInputRunId})</Label>
              <div className="space-y-2 max-h-32 overflow-auto pr-1">
                {availableFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No files uploaded yet.</p>
                ) : (
                  availableFiles.map((file) => {
                    const checked = selectedFiles.includes(file.filename);
                    return (
                      <div key={file.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`file-${file.id}`}
                          className="rounded border-border"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedFiles((prev) => [...prev, file.filename]);
                            else setSelectedFiles((prev) => prev.filter((f) => f !== file.filename));
                          }}
                        />
                        <Label htmlFor={`file-${file.id}`} className="text-xs cursor-pointer">
                          {file.filename}
                        </Label>
                      </div>
                    );
                  })
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Next run id (preview): <code>{runIdPreview}</code> (server will auto-generate)
              </p>
            </div>

            <div className="md:col-span-5 flex items-end">
              <Button className="bg-gradient-primary hover:opacity-90" onClick={handleGeneratePredictions}>
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
                      <p className="text-xs text-muted-foreground">(Future: load previous chats from backend)</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription className="text-white/80">
                Ask questions about your predictions and get intelligent insights
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 break-words ${
                        chat.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{chat.message}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-xs text-muted-foreground pl-4 pb-3">Thinking over your predictions…</div>
                )}
              </div>

              <div className="border-t p-4 flex-shrink-0">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask ModEx AI about your predictions..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <Button onClick={handleSendMessage} disabled={chatLoading} className="self-end">
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
              {modelRuns.length === 0 ? (
                <div className="text-sm text-muted-foreground">No model runs yet.</div>
              ) : (
                modelRuns.map((run) => (
                  <div key={run.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{run.run_id}</span>
                      {getStatusIcon(run.status)}
                    </div>
                    {run.date_range && <p className="text-xs text-muted-foreground mb-2">{run.date_range}</p>}
                    {run.region && <p className="text-xs text-muted-foreground mb-2">{run.region}</p>}
                    {run.files && <p className="text-xs text-muted-foreground mb-2">Files: {run.files}</p>}
                    {run.status === "in-progress" && <Progress value={run.progress} className="mb-2" />}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!run.results_url || run.status !== "success"}
                        onClick={() => run.results_url && window.open(run.results_url, "_blank")}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm" disabled>
                        <FileText className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRun(run.run_id)}>
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
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
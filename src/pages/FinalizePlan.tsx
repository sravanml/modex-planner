import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/Layout/Navbar";
import { 
  CheckCircle, 
  Download, 
  Edit3, 
  FileText,
  MessageSquare,
  Target,
  Calendar,
  MapPin,
  BarChart3,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlanData {
  product: string;
  demand: number;
  supply: number;
  gap: number;
  action: string;
}

interface FinalizedPlan {
  id: string;
  dateRange: string;
  region: string;
  runId: string;
  createdAt: string;
  status: string;
}

const FinalizePlan = () => {
  const [selectedRun, setSelectedRun] = useState("run_001");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editReason, setEditReason] = useState("");
  const [finalizedPlans, setFinalizedPlans] = useState<FinalizedPlan[]>([
    {
      id: 'plan_001',
      dateRange: '2024-01-01 to 2024-03-31',
      region: 'North America',
      runId: 'run_001',
      createdAt: '2024-01-15',
      status: 'Active'
    }
  ]);

  const [planData, setPlanData] = useState<PlanData[]>([
    {
      product: 'Widget A',
      demand: 1500,
      supply: 1400,
      gap: -100,
      action: 'Increase production'
    },
    {
      product: 'Widget B',
      demand: 2200,
      supply: 2300,
      gap: 100,
      action: 'Reduce inventory'
    },
    {
      product: 'Widget C',
      demand: 1800,
      supply: 1750,
      gap: -50,
      action: 'Monitor closely'
    }
  ]);

  const [chatSummary] = useState(
    "ModEx AI Analysis: The demand forecast shows strong seasonality patterns with 15% increase expected in Q2. Key risks include supply chain disruptions in Region A and potential stockouts for Widget A. Recommended actions have been incorporated into the plan."
  );

  const { toast } = useToast();

  const handleEdit = (index: number) => {
    setEditingRow(index);
  };

  const handleSaveEdit = (index: number) => {
    if (!editReason.trim()) {
      toast({
        title: "Edit Reason Required",
        description: "Please provide a reason for this edit",
        variant: "destructive"
      });
      return;
    }

    setEditingRow(null);
    setEditReason("");
    toast({
      title: "Changes Saved",
      description: "Your edits have been saved with reasoning",
    });
  };

  const handleFinalizePlan = () => {
    const newPlan: FinalizedPlan = {
      id: `plan_${Date.now()}`,
      dateRange: '2024-04-01 to 2024-06-30',
      region: 'North America',
      runId: selectedRun,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setFinalizedPlans(prev => [newPlan, ...prev]);
    
    toast({
      title: "Plan Finalized",
      description: `Plan ${newPlan.id} has been successfully finalized and is ready for download`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Finalize Plan</h1>
          <p className="text-muted-foreground">
            Review, edit, and finalize your supply chain plan based on model predictions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Plan Selection & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Plan Selection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Run ID</Label>
                  <Select value={selectedRun} onValueChange={setSelectedRun}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="run_001">run_001</SelectItem>
                      <SelectItem value="run_002">run_002</SelectItem>
                      <SelectItem value="run_003">run_003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">2024-01-01 to 2024-03-31</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">North America</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Confidence: 87%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>AI Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {chatSummary}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Plan Data Table */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Plan</CardTitle>
                <CardDescription>
                  Review and edit the model-generated plan. Click edit to modify values.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Forecasted Demand</TableHead>
                      <TableHead>Planned Supply</TableHead>
                      <TableHead>Gap</TableHead>
                      <TableHead>Recommended Action</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <Input 
                              type="number" 
                              defaultValue={item.demand}
                              className="w-20"
                            />
                          ) : (
                            item.demand.toLocaleString()
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <Input 
                              type="number" 
                              defaultValue={item.supply}
                              className="w-20"
                            />
                          ) : (
                            item.supply.toLocaleString()
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={item.gap < 0 ? 'text-destructive' : 'text-success'}>
                            {item.gap > 0 ? '+' : ''}{item.gap}
                          </span>
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <Input 
                              defaultValue={item.action}
                              className="w-32"
                            />
                          ) : (
                            item.action
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index ? (
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Reason for editing..."
                                value={editReason}
                                onChange={(e) => setEditReason(e.target.value)}
                                className="w-48 h-16"
                              />
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveEdit(index)}
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setEditingRow(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(index)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex space-x-4">
                    <Button 
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={handleFinalizePlan}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Finalize Plan
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Finalized Plans History */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Finalized Plans</CardTitle>
                <CardDescription>History of all finalized supply chain plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {finalizedPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{plan.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {plan.dateRange} • {plan.region} • {plan.runId}
                        </p>
                        <p className="text-xs text-muted-foreground">Created: {plan.createdAt}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">
                          {plan.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizePlan;
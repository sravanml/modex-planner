import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  MapPin,
  Package,
  Download,
  MessageSquare,
  Target,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

const Reporting = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [region, setRegion] = useState("");
  const [runId, setRunId] = useState("");
  const [planId, setPlanId] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [aiQuery, setAiQuery] = useState("");

  const forecastData = [
    { week: 'Week 1', actual: 1200, forecast: 1150, category: 'Electronics' },
    { week: 'Week 2', actual: 1350, forecast: 1380, category: 'Electronics' },
    { week: 'Week 3', actual: 1180, forecast: 1200, category: 'Electronics' },
    { week: 'Week 4', actual: 1420, forecast: 1400, category: 'Electronics' },
  ];

  const insights = [
    {
      type: 'highlight',
      title: 'Strong Q1 Performance',
      description: 'Electronics category exceeded forecast by 8% in March',
      icon: CheckCircle2,
      color: 'text-success'
    },
    {
      type: 'lowlight',
      title: 'Supply Chain Bottleneck',
      description: 'Widget A production delayed due to raw material shortage',
      icon: AlertTriangle,
      color: 'text-warning'
    }
  ];

  const handleAiQuery = () => {
    // Simulate AI response for reporting queries
    console.log('AI Query submitted:', aiQuery);
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold mb-2">Reporting & Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Generate comprehensive reports and analytics for your supply chain data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
                      <CardTitle className="text-sm font-bold">Filters</CardTitle>
                      <CardDescription>Customize your report parameters</CardDescription>
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
                        <Label>Region</Label>
                        <Select value={region} onValueChange={setRegion}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="north-america">North America</SelectItem>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Run ID</Label>
                        <Select value={runId} onValueChange={setRunId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select run ID" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="run_001">run_001</SelectItem>
                            <SelectItem value="run_002">run_002</SelectItem>
                            <SelectItem value="run_003">run_003</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Plan ID</Label>
                        <Select value={planId} onValueChange={setPlanId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select plan ID" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plan_001">plan_001</SelectItem>
                            <SelectItem value="plan_002">plan_002</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Product Category</Label>
                        <Select value={productCategory} onValueChange={setProductCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="automotive">Automotive</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full bg-gradient-primary hover:opacity-90">
                        Generate Report
                      </Button>
            </CardContent>
          </Card>

          <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-bold">
                        <MessageSquare className="h-5 w-5" />
                        <span>AI Insights</span>
                      </CardTitle>
                      <CardDescription>
                        Ask questions about your data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Ask about predictions, final plans, or actuals..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button onClick={handleAiQuery} className="w-full">
                        Ask AI
                      </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reports Display */}
        <div className="lg:col-span-3 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <Target className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">94.2%</p>
                            <p className="text-xs text-muted-foreground">Forecast Accuracy</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-8 w-8 text-success" />
                          <div>
                            <p className="text-2xl font-bold">+12%</p>
                            <p className="text-xs text-muted-foreground">Demand Growth</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <Package className="h-8 w-8 text-warning" />
                          <div>
                            <p className="text-2xl font-bold">87%</p>
                            <p className="text-xs text-muted-foreground">Service Level</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <TrendingDown className="h-8 w-8 text-destructive" />
                          <div>
                            <p className="text-2xl font-bold">-5%</p>
                            <p className="text-xs text-muted-foreground">Inventory Cost</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
          </div>

          {/* Demand Forecast Trend */}
          <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-bold">
                        <BarChart3 className="h-5 w-5" />
                        <span>Demand Forecast vs Actual</span>
                      </CardTitle>
                      <CardDescription>Weekly performance by product category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Interactive chart would display here</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Showing forecast accuracy and variance trends
                          </p>
                        </div>
                      </div>
                    </CardContent>
          </Card>

          {/* Forecast Accuracy Comparison */}
          <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Forecast vs Actual Comparison</CardTitle>
                      <CardDescription>Detailed accuracy metrics by region and time period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-4">Gap Analysis</h4>
                          <div className="space-y-3">
                            {forecastData.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded">
                                <span className="font-medium">{item.week}</span>
                                <div className="text-right">
                                  <p className="text-sm">
                                    Actual: <span className="font-medium">{item.actual}</span>
                                  </p>
                                  <p className="text-sm">
                                    Forecast: <span className="font-medium">{item.forecast}</span>
                                  </p>
                                  <p className={`text-xs ${
                                    item.actual > item.forecast ? 'text-success' : 'text-destructive'
                                  }`}>
                                    Gap: {item.actual - item.forecast}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-4">Accuracy Score</h4>
                          <div className="text-center p-8 border rounded-lg">
                            <div className="text-4xl font-bold text-primary mb-2">94.2%</div>
                            <p className="text-muted-foreground">Overall Accuracy</p>
                            <div className="mt-4 text-sm text-muted-foreground">
                              <p>Based on 4 weeks of data</p>
                              <p>Electronics category</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
          </Card>

          {/* Insights & Recommendations */}
          <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Key Insights</CardTitle>
                      <CardDescription>Highlights and lowlights from the selected run ID</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {insights.map((insight, index) => {
                          const IconComponent = insight.icon;
                          return (
                            <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                              <IconComponent className={`h-6 w-6 ${insight.color} mt-1`} />
                              <div>
                                <h4 className="font-medium mb-1">{insight.title}</h4>
                                <p className="text-sm text-muted-foreground">{insight.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Export Data</CardTitle>
                      <CardDescription>Download comprehensive reports and model predictions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Final Plan
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Predictions
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Full Report (PDF)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
        </div>
      </div>
    </>
  );
};

export default Reporting;
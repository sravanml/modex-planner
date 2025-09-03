import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Layout/Navbar";
import { 
  TrendingUp, 
  Truck, 
  Package, 
  Target, 
  Calendar,
  BarChart3,
  FileText,
  MessageSquare,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: "planning-forecasting",
      title: "Planning & Forecasting",
      description: "Demand planning, capacity planning, and inventory forecasting",
      icon: TrendingUp,
      subModules: [
        { name: "Demand Planning", path: "demand-planning" },
        { name: "Capacity Planning", path: "capacity-planning" },
        { name: "Inventory Forecasting", path: "inventory-forecasting" }
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "logistics-distribution",
      title: "Logistics & Distribution",
      description: "Fleet planning and route optimization solutions",
      icon: Truck,
      subModules: [
        { name: "Fleet Planning", path: "fleet-planning" },
        { name: "Route Optimization", path: "route-optimization" }
      ],
      color: "from-green-500 to-green-600"
    },
    {
      id: "warehouse-management",
      title: "Warehouse Management",
      description: "Stock replenishment, safety stock, and warehouse optimization",
      icon: Package,
      subModules: [
        { name: "Stock Replenishment", path: "stock-replenishment" },
        { name: "Safety Stock Calculation", path: "safety-stock" },
        { name: "Warehouse Layout", path: "warehouse-layout" }
      ],
      color: "from-purple-500 to-purple-600"
    }
  ];

  const workflowSteps = [
    {
      title: "Data Input Management",
      description: "Upload and manage your supply chain data",
      icon: FileText,
      path: "/workspace/planning-forecasting/demand-planning/data-input"
    },
    {
      title: "Prediction & Analysis",
      description: "Generate ML-powered predictions",
      icon: BarChart3,
      path: "/workspace/planning-forecasting/demand-planning/prediction"
    },
    {
      title: "Finalize Plan",
      description: "Review and finalize your supply chain plan",
      icon: Target,
      path: "/workspace/planning-forecasting/demand-planning/finalize-plan"
    },
    {
      title: "Reporting & Insights",
      description: "Analyze results and generate reports",
      icon: Calendar,
      path: "/workspace/planning-forecasting/demand-planning/reporting"
    },
    {
      title: "AI Experimentation",
      description: "Interact with ModEx AI for insights",
      icon: MessageSquare,
      path: "/workspace/planning-forecasting/demand-planning/experimentation"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-glow">
            <h1 className="text-4xl font-bold mb-4">Supply Chain Planning Dashboard</h1>
            <p className="text-xl opacity-90 mb-6">
              Optimize your supply chain with AI-powered planning modules
            </p>
            <Button 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/workspace/planning-forecasting/demand-planning')}
            >
              Start Planning <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Planning Modules Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Planning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              const moduleStartPath = `/workspace/${module.id}/${module.subModules[0].path}`;
              
              return (
                <Card 
                  key={module.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(moduleStartPath)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.subModules.map((subModule) => (
                        <Button
                          key={subModule.name}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-auto p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            const subModulePath = `/workspace/${module.id}/${subModule.path}`;
                            navigate(subModulePath);
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                          {subModule.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Workflow Steps Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Planning Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {workflowSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card 
                  key={step.path} 
                  className="hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(step.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Truck, 
  Package,
  ChevronRight,
  CheckCircle,
  Clock,
  Circle
} from "lucide-react";

interface ModuleProgress {
  dataInput: number;
  prediction: number;
  finalizePlan: number;
  reporting: number;
  experimentation: number;
}

interface PlanningModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  subModules: string[];
  color: string;
  progress: ModuleProgress;
}

const modules: PlanningModule[] = [
  {
    id: "planning-forecasting",
    title: "Planning & Forecasting",
    description: "Demand planning, capacity planning, and inventory forecasting",
    icon: TrendingUp,
    subModules: ["Demand Planning", "Capacity Planning", "Inventory Forecasting"],
    color: "from-blue-500 to-blue-600",
    progress: {
      dataInput: 100,
      prediction: 75,
      finalizePlan: 50,
      reporting: 25,
      experimentation: 0
    }
  },
  {
    id: "logistics-distribution", 
    title: "Logistics & Distribution",
    description: "Fleet planning and route optimization solutions",
    icon: Truck,
    subModules: ["Fleet Planning", "Route Optimization"],
    color: "from-green-500 to-green-600",
    progress: {
      dataInput: 100,
      prediction: 0,
      finalizePlan: 0,
      reporting: 0,
      experimentation: 0
    }
  },
  {
    id: "warehouse-management",
    title: "Warehouse Management", 
    description: "Stock replenishment, safety stock, and warehouse optimization",
    icon: Package,
    subModules: ["Stock Replenishment", "Safety Stock Calculation", "Warehouse Layout"],
    color: "from-purple-500 to-purple-600",
    progress: {
      dataInput: 0,
      prediction: 0,
      finalizePlan: 0,
      reporting: 0,
      experimentation: 0
    }
  }
];

const workflowSteps = [
  { id: 'dataInput', name: 'Data Input', path: '/data-input' },
  { id: 'prediction', name: 'Prediction', path: '/prediction' },
  { id: 'finalizePlan', name: 'Finalize Plan', path: '/finalize-plan' },
  { id: 'reporting', name: 'Reporting', path: '/reporting' },
  { id: 'experimentation', name: 'Experimentation', path: '/experimentation' }
];

interface ModuleSelectorProps {
  selectedModule: string;
  onModuleSelect: (moduleId: string, subModule?: string) => void;
  currentStep?: string;
  onStepSelect?: (stepId: string) => void;
}

export function ModuleSelector({ selectedModule, onModuleSelect, currentStep, onStepSelect }: ModuleSelectorProps) {
  const selectedModuleData = modules.find(m => m.id === selectedModule) || modules[0];
  
  const getStepIcon = (stepId: string, progress: number) => {
    if (progress === 100) {
      return <CheckCircle className="h-4 w-4 text-success" />;
    } else if (progress > 0) {
      return <Clock className="h-4 w-4 text-warning" />;
    }
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Module Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Planning Module</CardTitle>
          <CardDescription>Choose a module to configure and track progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((module) => {
              const IconComponent = module.icon;
              const isSelected = selectedModule === module.id;
              const totalProgress = Object.values(module.progress).reduce((a, b) => a + b, 0) / 5;
              
              return (
                <Card 
                  key={module.id} 
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
                  }`}
                  onClick={() => onModuleSelect(module.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{module.title}</h4>
                        <Progress value={totalProgress} className="h-2 mt-1" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{module.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {module.subModules.map((subModule) => (
                        <Badge key={subModule} variant="secondary" className="text-xs">
                          {subModule}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Module Workflow */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${selectedModuleData.color} flex items-center justify-center`}>
              <selectedModuleData.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>{selectedModuleData.title} - Workflow</CardTitle>
              <CardDescription>Track progress through each stage of the planning workflow</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, index) => {
              const progress = selectedModuleData.progress[step.id as keyof ModuleProgress];
              const isActive = currentStep === step.id;
              
              return (
                <Button
                  key={step.id}
                  variant={isActive ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                    onStepSelect ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  onClick={() => onStepSelect?.(step.id)}
                >
                  <div className="flex items-center space-x-2">
                    {getStepIcon(step.id, progress)}
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                  <div className="w-full">
                    <Progress value={progress} className="h-2" />
                    <span className="text-xs text-muted-foreground mt-1">{progress}%</span>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ChevronRight className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sub-modules for selected module */}
      <Card>
        <CardHeader>
          <CardTitle>Available Sub-modules</CardTitle>
          <CardDescription>Select specific areas within {selectedModuleData.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedModuleData.subModules.map((subModule) => (
              <Button
                key={subModule}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => onModuleSelect(selectedModule, subModule)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{subModule}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
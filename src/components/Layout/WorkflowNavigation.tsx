import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Upload, 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  FlaskConical
} from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  icon: any;
  path: string;
}

const workflowSteps: WorkflowStep[] = [
  { id: 'data-input', name: 'Data Input', icon: Upload, path: '/data-input' },
  { id: 'prediction', name: 'Prediction & Analysis', icon: BarChart3, path: '/prediction' },
  { id: 'finalize-plan', name: 'Finalize Plan', icon: CheckCircle2, path: '/finalize-plan' },
  { id: 'reporting', name: 'Reporting', icon: FileText, path: '/reporting' },
  { id: 'experimentation', name: 'Experimentation', icon: FlaskConical, path: '/experimentation' }
];

interface WorkflowNavigationProps {
  moduleId: string;
  subModuleId: string;
  currentStep?: string;
}

export function WorkflowNavigation({ moduleId, subModuleId, currentStep }: WorkflowNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock progress data - in real app this would come from context/store
  const getStepProgress = (stepId: string) => {
    const progressData: Record<string, number> = {
      'data-input': 100,
      'prediction': 75,
      'finalize-plan': 50,
      'reporting': 25,
      'experimentation': 0
    };
    return progressData[stepId] || 0;
  };

  const handleStepClick = (stepPath: string) => {
    // Navigate to the step within the current workspace context
    const workspacePath = `/workspace/${moduleId}/${subModuleId}${stepPath}`;
    navigate(workspacePath);
  };

  const isCurrentStep = (stepPath: string) => {
    return location.pathname.includes(stepPath);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Workflow Stages</h3>
        <div className="text-sm text-muted-foreground">
          Track progress through each planning stage
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {workflowSteps.map((step, index) => {
          const IconComponent = step.icon;
          const progress = getStepProgress(step.id);
          const isActive = isCurrentStep(step.path);
          
          return (
            <Button
              key={step.id}
              variant={isActive ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center space-y-2 relative"
              onClick={() => handleStepClick(step.path)}
            >
              <div className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{step.name}</span>
              </div>
              
              <div className="w-full">
                <Progress value={progress} className="h-2" />
                <span className="text-xs text-muted-foreground mt-1">{progress}%</span>
              </div>
              
              {index < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-1.5 top-1/2 transform -translate-y-1/2 w-3 h-0.5 bg-border"></div>
              )}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
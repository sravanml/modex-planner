import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  // Component for circular progress indicator
  const CircularProgress = ({ progress, isActive }: { progress: number; isActive: boolean }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative">
        <svg width="48" height="48" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-muted-foreground/30"
          />
          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={isActive ? "text-primary-foreground" : "text-primary"}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">{progress}%</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold">Workflow Stages</h3>
        <div className="text-sm text-muted-foreground">
          Track progress through each planning stage
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-4">
        {workflowSteps.map((step, index) => {
          const IconComponent = step.icon;
          const progress = getStepProgress(step.id);
          const isActive = isCurrentStep(step.path);
          
          return (
            <div key={step.id} className="flex items-center">
              <Button
                variant="ghost"
                className="flex flex-col items-center space-y-2 p-2 h-auto"
                onClick={() => handleStepClick(step.path)}
              >
                <CircularProgress progress={progress} isActive={isActive} />
                <div className="flex flex-col items-center space-y-1">
                  <IconComponent className="h-3 w-3" />
                  <span className="text-xs font-medium text-center leading-tight">{step.name}</span>
                </div>
              </Button>
              
              {index < workflowSteps.length - 1 && (
                <div className="w-8 h-0.5 bg-border mx-2"></div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
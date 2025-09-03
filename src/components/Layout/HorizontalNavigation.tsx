import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Upload, 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  FlaskConical
} from "lucide-react";

interface NavigationPage {
  id: string;
  name: string;
  icon: any;
  path: string;
}

const navigationPages: NavigationPage[] = [
  { id: 'data-input', name: 'Data Input', icon: Upload, path: '/data-input' },
  { id: 'prediction', name: 'Prediction & Analysis', icon: BarChart3, path: '/prediction' },
  { id: 'finalize-plan', name: 'Finalize Plan', icon: CheckCircle2, path: '/finalize-plan' },
  { id: 'reporting', name: 'Reporting', icon: FileText, path: '/reporting' },
  { id: 'experimentation', name: 'Experimentation', icon: FlaskConical, path: '/experimentation' }
];

interface HorizontalNavigationProps {
  moduleId: string;
  subModuleId: string;
  currentStep?: string;
}

export function HorizontalNavigation({ moduleId, subModuleId, currentStep }: HorizontalNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageClick = (pagePath: string) => {
    // Navigate to the page within the current workspace context
    const workspacePath = `/workspace/${moduleId}/${subModuleId}${pagePath}`;
    navigate(workspacePath);
  };

  const isCurrentPage = (pagePath: string) => {
    return location.pathname.includes(pagePath);
  };

  return (
    <div className="border-b border-border mb-6">
      <div className="flex items-center space-x-6 pb-4">
        {navigationPages.map((page) => {
          const IconComponent = page.icon;
          const isActive = isCurrentPage(page.path);
          
          return (
            <Button
              key={page.id}
              variant="ghost"
              className={`flex items-center space-x-2 p-2 h-auto border-b-2 rounded-none ${
                isActive 
                  ? 'border-primary text-primary font-medium' 
                  : 'border-transparent hover:text-foreground'
              }`}
              onClick={() => handlePageClick(page.path)}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-sm">{page.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
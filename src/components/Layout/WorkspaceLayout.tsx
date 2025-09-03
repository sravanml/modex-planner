import { MainLayout } from "./MainLayout";
import { WorkflowNavigation } from "./WorkflowNavigation";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  moduleId: string;
  subModuleId: string;
  currentStep?: string;
  title: string;
  description?: string;
}

export function WorkspaceLayout({ 
  children, 
  moduleId, 
  subModuleId, 
  currentStep, 
  title, 
  description 
}: WorkspaceLayoutProps) {
  return (
    <MainLayout>
      <div className="p-6">
        {/* Workspace Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <span className="capitalize">{moduleId.replace('-', ' & ')}</span>
            <span>/</span>
            <span className="capitalize">{subModuleId.replace('-', ' ')}</span>
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>

        {/* Workflow Navigation */}
        <WorkflowNavigation 
          moduleId={moduleId}
          subModuleId={subModuleId}
          currentStep={currentStep}
        />

        {/* Page Content */}
        {children}
      </div>
    </MainLayout>
  );
}
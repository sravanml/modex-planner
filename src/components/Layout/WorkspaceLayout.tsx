import { MainLayout } from "./MainLayout";
import { HorizontalNavigation } from "./HorizontalNavigation";

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
          <div className="flex items-center space-x-2 text-sm font-bold mb-4">
            <span className="capitalize">{moduleId.replace('-', ' & ')}</span>
            <span>/</span>
            <span className="capitalize">{subModuleId.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <HorizontalNavigation 
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
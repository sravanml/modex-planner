import { useParams, Navigate, Routes, Route } from "react-router-dom";
import { WorkspaceLayout } from "@/components/Layout/WorkspaceLayout";
import DataInput from "./DataInput";
import Prediction from "./Prediction";
import FinalizePlan from "./FinalizePlan";
import Reporting from "./Reporting";
import Experimentation from "./Experimentation";

// Module and submodule metadata
const moduleData: Record<string, { title: string; subModules: Record<string, string> }> = {
  "planning-forecasting": {
    title: "Planning & Forecasting",
    subModules: {
      "demand-planning": "Demand Planning",
      "capacity-planning": "Capacity Planning", 
      "inventory-forecasting": "Inventory Forecasting"
    }
  },
  "logistics-distribution": {
    title: "Logistics & Distribution",
    subModules: {
      "fleet-planning": "Fleet Planning",
      "route-optimization": "Route Optimization"
    }
  },
  "warehouse-management": {
    title: "Warehouse Management",
    subModules: {
      "stock-replenishment": "Stock Replenishment",
      "safety-stock": "Safety Stock Calculation",
      "warehouse-layout": "Warehouse Layout"
    }
  }
};

export default function Workspace() {
  const { moduleId, subModuleId } = useParams<{ moduleId: string; subModuleId: string }>();

  if (!moduleId || !subModuleId) {
    return <Navigate to="/workspace/planning-forecasting/demand-planning" replace />;
  }

  const module = moduleData[moduleId];
  const subModuleName = module?.subModules[subModuleId];

  if (!module || !subModuleName) {
    return <Navigate to="/workspace/planning-forecasting/demand-planning" replace />;
  }

  const workspaceTitle = `${subModuleName} - ${module.title}`;

  return (
    <Routes>
      <Route path="/data-input" element={
        <WorkspaceLayout 
          moduleId={moduleId}
          subModuleId={subModuleId}
          currentStep="data-input"
          title={workspaceTitle}
          description="Upload and manage your supply chain data files for analysis and planning"
        >
          <DataInput />
        </WorkspaceLayout>
      } />
      
      <Route path="/prediction" element={
        <WorkspaceLayout 
          moduleId={moduleId}
          subModuleId={subModuleId}
          currentStep="prediction"
          title={workspaceTitle}
          description="AI-powered predictions and analysis for informed decision making"
        >
          <Prediction />
        </WorkspaceLayout>
      } />
      
      <Route path="/finalize-plan" element={
        <WorkspaceLayout 
          moduleId={moduleId}
          subModuleId={subModuleId}
          currentStep="finalize-plan"
          title={workspaceTitle}
          description="Review and finalize your optimized supply chain plan"
        >
          <FinalizePlan />
        </WorkspaceLayout>
      } />
      
      <Route path="/reporting" element={
        <WorkspaceLayout 
          moduleId={moduleId}
          subModuleId={subModuleId}
          currentStep="reporting"
          title={workspaceTitle}
          description="Generate comprehensive reports and analytics"
        >
          <Reporting />
        </WorkspaceLayout>
      } />
      
      <Route path="/experimentation" element={
        <WorkspaceLayout 
          moduleId={moduleId}
          subModuleId={subModuleId}
          currentStep="experimentation"
          title={workspaceTitle}
          description="Test different scenarios and optimize your strategy"
        >
          <Experimentation />
        </WorkspaceLayout>
      } />
      
      {/* Default redirect to data-input */}
      <Route path="/" element={<Navigate to="data-input" replace />} />
      <Route path="/*" element={<Navigate to="data-input" replace />} />
    </Routes>
  );
}
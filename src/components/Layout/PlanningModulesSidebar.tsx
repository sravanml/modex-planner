import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Truck, 
  Package,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface PlanningModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  subModules: string[];
  color: string;
}

const modules: PlanningModule[] = [
  {
    id: "planning-forecasting",
    title: "Planning & Forecasting",
    description: "Demand planning, capacity planning, and inventory forecasting",
    icon: TrendingUp,
    subModules: ["Demand Planning", "Capacity Planning", "Inventory Forecasting"],
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "logistics-distribution", 
    title: "Logistics & Distribution",
    description: "Fleet planning and route optimization solutions",
    icon: Truck,
    subModules: ["Fleet Planning", "Route Optimization"],
    color: "from-green-500 to-green-600"
  },
  {
    id: "warehouse-management",
    title: "Warehouse Management", 
    description: "Stock replenishment, safety stock, and warehouse optimization",
    icon: Package,
    subModules: ["Stock Replenishment", "Safety Stock Calculation", "Warehouse Layout"],
    color: "from-purple-500 to-purple-600"
  }
];

interface PlanningModulesSidebarProps {
  selectedModule?: string;
  onModuleSelect?: (moduleId: string, subModule?: string) => void;
}

export function PlanningModulesSidebar({ selectedModule, onModuleSelect }: PlanningModulesSidebarProps) {
  const { state } = useSidebar();
  const [expandedModules, setExpandedModules] = useState<string[]>([selectedModule || modules[0].id]);
  const isCollapsed = state === "collapsed";

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleModuleSelect = (moduleId: string, subModule?: string) => {
    onModuleSelect?.(moduleId, subModule);
  };

  return (
    <Sidebar
      className={`${isCollapsed ? "w-16" : "w-80"} border-r bg-card`}
      collapsible="icon"
    >
      <div className="p-4 border-b">
        <SidebarTrigger />
        {!isCollapsed && (
          <div className="mt-2">
            <h2 className="text-lg font-semibold">Planning Modules</h2>
            <p className="text-sm text-muted-foreground">Select a module to configure</p>
          </div>
        )}
      </div>

      <SidebarContent className="p-4">
        {isCollapsed ? (
          <div className="space-y-4">
            {modules.map((module) => {
              const IconComponent = module.icon;
              const isSelected = selectedModule === module.id;
              return (
                <div
                  key={module.id}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    isSelected 
                      ? `bg-gradient-to-r ${module.color} text-white shadow-md` 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleModuleSelect(module.id)}
                  title={module.title}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => {
              const IconComponent = module.icon;
              const isSelected = selectedModule === module.id;
              const isExpanded = expandedModules.includes(module.id);
              
              return (
                <Card 
                  key={module.id} 
                  className={`transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader 
                    className="pb-2 cursor-pointer"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-sm">{module.title}</CardTitle>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {module.subModules.map((subModule) => (
                          <div
                            key={subModule}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors cursor-pointer text-sm"
                            onClick={() => handleModuleSelect(module.id, subModule)}
                          >
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                              {subModule}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Active
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
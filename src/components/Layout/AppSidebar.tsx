import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Truck, 
  Package,
  ChevronDown,
  ChevronRight
} from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface SubModule {
  id: string;
  name: string;
  path: string;
}

interface PlanningModule {
  id: string;
  title: string;
  icon: any;
  subModules: SubModule[];
}

const modules: PlanningModule[] = [
  {
    id: "planning-forecasting",
    title: "Planning & Forecasting", 
    icon: TrendingUp,
    subModules: [
      { id: "demand-planning", name: "Demand Planning", path: "/workspace/planning-forecasting/demand-planning" },
      { id: "capacity-planning", name: "Capacity Planning", path: "/workspace/planning-forecasting/capacity-planning" },
      { id: "inventory-forecasting", name: "Inventory Forecasting", path: "/workspace/planning-forecasting/inventory-forecasting" }
    ]
  },
  {
    id: "logistics-distribution",
    title: "Logistics & Distribution",
    icon: Truck,
    subModules: [
      { id: "fleet-planning", name: "Fleet Planning", path: "/workspace/logistics-distribution/fleet-planning" },
      { id: "route-optimization", name: "Route Optimization", path: "/workspace/logistics-distribution/route-optimization" }
    ]
  },
  {
    id: "warehouse-management",
    title: "Warehouse Management",
    icon: Package,
    subModules: [
      { id: "stock-replenishment", name: "Stock Replenishment", path: "/workspace/warehouse-management/stock-replenishment" },
      { id: "safety-stock", name: "Safety Stock Calculation", path: "/workspace/warehouse-management/safety-stock" },
      { id: "warehouse-layout", name: "Warehouse Layout", path: "/workspace/warehouse-management/warehouse-layout" }
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<string[]>(["planning-forecasting"]);
  
  const isModuleExpanded = (moduleId: string) => expandedModules.includes(moduleId);
  
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isSubModuleActive = (path: string) => location.pathname.startsWith(path);

  const handleSubModuleClick = (path: string) => {
    navigate(path);
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <div className="p-4">
        <SidebarTrigger className="mb-4" />
        {!isCollapsed && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Supply Chain Planning</h2>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Planning Modules</SidebarGroupLabel>}
          
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((module) => {
                const IconComponent = module.icon;
                const isExpanded = isModuleExpanded(module.id);
                
                return (
                  <SidebarMenuItem key={module.id}>
                    {isCollapsed ? (
                      <SidebarMenuButton 
                        tooltip={module.title}
                        onClick={() => navigate(module.subModules[0].path)}
                      >
                        <IconComponent className="h-4 w-4" />
                      </SidebarMenuButton>
                    ) : (
                      <Collapsible open={isExpanded} onOpenChange={() => toggleModule(module.id)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full justify-between">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{module.title}</span>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="ml-4 mt-2 space-y-1">
                            {module.subModules.map((subModule) => (
                              <Button
                                key={subModule.id}
                                variant={isSubModuleActive(subModule.path) ? "secondary" : "ghost"}
                                size="sm"
                                className="w-full justify-start text-sm"
                                onClick={() => handleSubModuleClick(subModule.path)}
                              >
                                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                {subModule.name}
                              </Button>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
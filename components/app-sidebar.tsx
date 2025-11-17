"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Users, Home, Calendar } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    accent: "text-sky-600",
  },
  {
    title: "Consultations",
    url: "/consultations",
    icon: FileText,
    accent: "text-cyan-600",
  },
  {
    title: "Schedule",
    url: "/agenda",
    icon: Calendar,
    accent: "text-sky-500",
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Users,
    accent: "text-emerald-600",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
const {state} = useSidebar();


  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="md:pl-2 md:py-4 md:peer-data-[variant=inset]:shadow-lg"
    >
      {/* Thin rail shown when collapsed */}
      <SidebarRail className="bg-transparent" />

      <div 
      style={{ background: 'linear-gradient(137deg, #165dfc, transparent)'}}
      className="flex h-full flex-col rounded-l-[1.75rem] py-4 shadow-md shadow-slate-200 text-white w-[135%]">
        <SidebarHeader className="border-none p-0 pb-4 text-white">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-white text-white shadow-sm">
              <span className="text-lg font-semibold"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-white">
                DoKKo
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                Doc App
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-0">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="relative">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="my-2 h-11 rounded-r-2xl rounded-l-none bg-transparent text-white/90 hover:bg-white/10 data-[active=true]:bg-white data-[active=true]:text-slate-700 data-[active=true]:relative data-[active=true]:z-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:data-[active=true]:mr-0 group-data-[collapsible=icon]:data-[active=true]:pr-0 group-data-[collapsible=icon]:data-[active=true]:rounded-r-full"
                
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                      >
                        <div className={`flex items-center justify-center bg-white rounded-xl ${state === 'collapsed' ? 'p-[5px]' : 'size-8'} text-sky-700 shadow-sm group-data-[active=true]/menu-item:bg-[#155dfc] group-data-[active=true]/menu-item:text-white group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:rounded-full`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}

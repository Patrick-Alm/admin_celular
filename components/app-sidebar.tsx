"use client"

import * as React from "react"
import {
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  Smartphone,
  Tags,
  User,
  UserCog,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "admin",
    email: "admin@admin.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Revenda dos Guri",
      logo: GalleryVerticalEnd,
      plan: "Empresa",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/app/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Admin",
      url: "/app/admin",
      icon: UserCog,
    },
    {
      title: "Celulares",
      url: "/app/celulares",
      icon: Smartphone,
    },
    {
      title: "Clientes",
      url: "/app/clientes",
      icon: User,
    },
    {
      title: "Marcas",
      url: "/app/marcas",
      icon: Tags,
    },
    {
      title: "Propostas",
      url: "/app/propostas",
      icon: FileText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

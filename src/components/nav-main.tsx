"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground">System Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Check if any sub-item is active
          const hasActiveSubItem = item.items?.some(subItem => pathname === subItem.url)
          // Check if the main item is active
          const isMainItemActive = pathname === item.url
          // Check if the main item should be open (has active sub-item or is active itself)
          const shouldBeOpen = hasActiveSubItem || isMainItemActive

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={shouldBeOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isMainItemActive}
                    className="data-[active=true]:bg-secondary/60 data-[active=true]:text-foreground hover:bg-secondary/50"
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive = pathname === subItem.url
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubItemActive}
                            className="data-[active=true]:bg-secondary/60 data-[active=true]:text-foreground hover:bg-secondary/50"
                          >
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { event } = page.props as any;
    
    // Check if the current URL starts with the item's href for nested routing
    const isActiveRoute = (itemHref: string) => {
        return page.url.startsWith(itemHref);
    };
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // If routeName is provided and event exists, use route() with event ID
                    let href = item.href;
                    
                    if (item.routeName) {
                        if (event) {
                            // Use the event ID directly in the route parameters
                            href = route(item.routeName, { 
                                ...(item.params || {}), 
                                event: event.id 
                            });
                        } else if (page.url.includes('/events/')) {
                            // Extract event ID from URL if available
                            const matches = page.url.match(/\/events\/(\d+)/);
                            const eventId = matches ? matches[1] : null;
                            
                            if (eventId) {
                                href = route(item.routeName, { 
                                    ...(item.params || {}), 
                                    event: eventId 
                                });
                            }
                        }
                    }
                    
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isActiveRoute(href)}>
                                <Link href={href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

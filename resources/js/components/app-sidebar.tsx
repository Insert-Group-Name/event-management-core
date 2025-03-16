import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, Folder, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

interface Event {
    id: number;
    title: string;
}

export function AppSidebar() {
    const { props } = usePage();
    // Use type assertion for TypeScript
    const event = props.event as Event | undefined;
    const eventId = event?.id;
    
    // Use dynamic event ID if available
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            routeName: eventId ? 'event.dashboard' : 'dashboard',
            href: eventId ? `/events/${eventId}/dashboard` : '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Agenda',
            routeName: 'event.agenda.index',
            href: eventId ? `/events/${eventId}/agenda` : '/events',
            icon: Calendar,
        },
        {
            title: 'Attendees',
            routeName: 'event.attendees.index',
            href: eventId ? `/events/${eventId}/attendees` : '/events',
            icon: Users,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

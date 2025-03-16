import DashboardNotificationStream from '@/components/dashboard-notification-stream';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Event } from '@/types/event';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Activity, ThumbsUp, Users } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';


type EngagementStats = {
    totalUsers: number;
    activeUsers: number;
    totalInteractions: number;
    avgRating: number;
    pollParticipation: number;
    qaParticipation: number;
};

type ActivityStats = {
    id: string;
    name: string;
    attendees: number;
    engagement: number;
    ratings: number;
    questions: number;
};

interface Props {
    event: Event;
    initialStats?: EngagementStats;
    initialActivityStats?: ActivityStats[];
}

export default function Dashboard({
    event,
    initialStats = {
        totalUsers: 0,
        activeUsers: 0,
        totalInteractions: 0,
        avgRating: 0,
        pollParticipation: 0,
        qaParticipation: 0,
    },
    initialActivityStats = [],
}: Props) {
    const [stats, setStats] = useState<EngagementStats>(initialStats);
    const [activityStats, setActivityStats] = useState<ActivityStats[]>(initialActivityStats);
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: event.name,
            href: `/events/${event.id}`,
        },
        {
            title: 'Dashboard',
            href: `/events/${event.id}/dashboard`,
        },
    ];

    const handleBroadcastNotificationSubmit = async (e: React.FormEvent) => {
        try {
            const response = await axios.post('/events/broadcast-notification', {
                title: 'Test Notification',
                description: 'This is a test notification',
                attendee_name: 'John Doe',
                type: 'view',
            });
        } catch (err: any) {
            console.error(err.response?.data?.message || 'An error occurred while sending the notification');
        }
    };

    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
        try {
            // In a real implementation, you would fetch this data from your API
            // Here we'll use mock data as an example

            // Get overall stats
            const mockStats: EngagementStats = {
                totalUsers: 120,
                activeUsers: 78,
                totalInteractions: 342,
                avgRating: 4.2,
                pollParticipation: 67,
                qaParticipation: 45,
            };

            // Get per-activity stats
            const mockActivityStats: ActivityStats[] = [
                {
                    id: 'activity1',
                    name: 'Keynote Session',
                    attendees: 98,
                    engagement: 210,
                    ratings: 45,
                    questions: 28,
                },
                {
                    id: 'activity2',
                    name: 'Workshop Session',
                    attendees: 42,
                    engagement: 132,
                    ratings: 38,
                    questions: 17,
                },
            ];

            setStats(mockStats);
            setActivityStats(mockActivityStats);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${event.name} Dashboard`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex h-full flex-1 flex-col space-y-4 rounded-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{event.name} Dashboard</h1>
                            <p className="text-muted-foreground">
                                {format(new Date(event.start_date), 'MMMM d, yyyy')} - {format(new Date(event.end_date), 'MMMM d, yyyy')}
                            </p>
                        </div>
                        <Button onClick={handleBroadcastNotificationSubmit}>Refresh Data</Button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <Users className="text-muted-foreground mr-2 h-5 w-5" />
                                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                </div>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    <span className="font-medium text-green-500">{stats.activeUsers} active now</span> (
                                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <Activity className="text-muted-foreground mr-2 h-5 w-5" />
                                    <div className="text-2xl font-bold">{stats.totalInteractions}</div>
                                </div>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    Avg {(stats.totalInteractions / Math.max(1, stats.activeUsers)).toFixed(1)} per active user
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <ThumbsUp className="text-muted-foreground mr-2 h-5 w-5" />
                                    <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}/5.0</div>
                                </div>
                                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                    <div className="h-full rounded-full bg-green-500" style={{ width: `${(stats.avgRating / 5) * 100}%` }}></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {/* Activity Stats */}
                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Activity Performance</CardTitle>
                                    <CardDescription>Key metrics for each activity in the event</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {activityStats.map((activity) => (
                                            <div key={activity.id} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-medium">{activity.name}</div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedActivity(selectedActivity === activity.id ? null : activity.id)}
                                                    >
                                                        {selectedActivity === activity.id ? 'Hide Details' : 'Show Details'}
                                                    </Button>
                                                </div>

                                                <div className="flex justify-between text-sm">
                                                    <span>Attendees: {activity.attendees}</span>
                                                    <span>Engagement: {activity.engagement}</span>
                                                </div>

                                                <Progress value={(activity.engagement / Math.max(1, activity.attendees)) * 50} className="h-2" />

                                                {selectedActivity === activity.id && (
                                                    <div className="bg-muted mt-2 grid grid-cols-2 gap-2 rounded-md p-2 md:grid-cols-4">
                                                        <div className="text-center">
                                                            <div className="text-muted-foreground text-xs">Attendees</div>
                                                            <div className="font-medium">{activity.attendees}</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-muted-foreground text-xs">Engagement</div>
                                                            <div className="font-medium">{activity.engagement}</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-muted-foreground text-xs">Ratings</div>
                                                            <div className="font-medium">{activity.ratings}</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-muted-foreground text-xs">Questions</div>
                                                            <div className="font-medium">{activity.questions}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* User Activity Stream */}
                        <div>
                            <DashboardNotificationStream />
                        </div>
                    </div>

                    {/* Engagement Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Engagement Breakdown</CardTitle>
                            <CardDescription>Participation across different interaction types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="text-sm font-medium">Poll Participation</div>
                                        <div className="text-muted-foreground text-sm">
                                            {stats.pollParticipation}/{stats.totalUsers}
                                        </div>
                                    </div>
                                    <Progress value={(stats.pollParticipation / Math.max(1, stats.totalUsers)) * 100} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="text-sm font-medium">Q&A Participation</div>
                                        <div className="text-muted-foreground text-sm">
                                            {stats.qaParticipation}/{stats.totalUsers}
                                        </div>
                                    </div>
                                    <Progress value={(stats.qaParticipation / Math.max(1, stats.totalUsers)) * 100} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="text-sm font-medium">Rating Participation</div>
                                        <div className="text-muted-foreground text-sm">{stats.avgRating > 0 ? 'Active' : 'None'}</div>
                                    </div>
                                    <Progress value={(stats.avgRating / 5) * 100} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="text-sm font-medium">Active Users</div>
                                        <div className="text-muted-foreground text-sm">
                                            {stats.activeUsers}/{stats.totalUsers}
                                        </div>
                                    </div>
                                    <Progress value={(stats.activeUsers / Math.max(1, stats.totalUsers)) * 100} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

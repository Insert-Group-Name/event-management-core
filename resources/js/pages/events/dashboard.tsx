import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Event } from '@/types/event';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart, Activity, MessageSquare, ThumbsUp, HelpCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

// Mock data - replace with real API calls
type UserActivity = {
  id: string;
  userId: string;
  userName: string;
  type: 'view' | 'poll' | 'qa' | 'chat' | 'rating' | 'checkin';
  activityId: string;
  activityName: string;
  timestamp: Date;
  data?: Record<string, unknown>;
};

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
  initialActivities?: UserActivity[];
  initialStats?: EngagementStats;
  initialActivityStats?: ActivityStats[];
}

export default function Dashboard({ 
  event, 
  initialActivities = [],
  initialStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalInteractions: 0,
    avgRating: 0,
    pollParticipation: 0,
    qaParticipation: 0
  },
  initialActivityStats = []
}: Props) {
  const [activities, setActivities] = useState<UserActivity[]>(initialActivities);
  const [stats, setStats] = useState<EngagementStats>(initialStats);
  const [activityStats, setActivityStats] = useState<ActivityStats[]>(initialActivityStats);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Events',
      href: '/events',
    },
    {
      title: event.name,
      href: `/events/${event.id}`,
    },
    {
      title: 'Dashboard',
      href: `/events/${event.id}/dashboard`,
    },
  ];

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    // For now, we'll use mock/simulated data
    // In a real implementation, you would connect to a WebSocket server
    
    // Add simulated real-time data updates - random intervals between 3-8 seconds
    const updateInterval = setInterval(() => {
      // Generate a random user activity
      const activityTypes: UserActivity['type'][] = ['view', 'poll', 'qa', 'chat', 'rating', 'checkin'];
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      // Select a random activity
      const activityId = activityStats.length > 0 
        ? activityStats[Math.floor(Math.random() * activityStats.length)].id 
        : 'activity1';
      
      const activityName = activityStats.find(a => a.id === activityId)?.name || 'Unknown Activity';
      
      // Create a simulated user activity
      const mockActivity: UserActivity = {
        id: `activity-${Date.now()}`,
        userId: `user${Math.floor(Math.random() * 100) + 1}`,
        userName: `User ${Math.floor(Math.random() * 100) + 1}`,
        type: randomType,
        activityId,
        activityName,
        timestamp: new Date(),
        data: {}
      };
      
      // For rating activities, add a random rating
      if (randomType === 'rating') {
        mockActivity.data = { rating: Math.floor(Math.random() * 5) + 1 };
      }
      
      // Update the activities state
      setActivities(prev => [mockActivity, ...prev].slice(0, 50));
      
      // Update stats based on activity type
      setStats(prevStats => {
        const newStats = { ...prevStats };
        newStats.totalInteractions += 1;
        
        // Update specific stats based on activity type
        switch (randomType) {
          case 'poll':
            newStats.pollParticipation += 1;
            break;
          case 'qa':
            newStats.qaParticipation += 1;
            break;
          case 'rating':
            // Calculate new average rating
            if (mockActivity.data?.rating) {
              const totalRatings = prevStats.avgRating * (prevStats.totalInteractions - 1);
              const newRating = mockActivity.data.rating as number;
              newStats.avgRating = (totalRatings + newRating) / prevStats.totalInteractions;
            }
            break;
        }
        
        return newStats;
      });
      
      // Update activity-specific stats
      setActivityStats(prev => {
        const updatedStats = [...prev];
        const activityIndex = updatedStats.findIndex(a => a.id === activityId);
        
        if (activityIndex >= 0) {
          const activity = { ...updatedStats[activityIndex] };
          
          // Update activity stats based on the type
          activity.engagement += 1;
          
          switch (randomType) {
            case 'checkin':
              activity.attendees += 1;
              break;
            case 'qa':
              activity.questions += 1;
              break;
            case 'rating':
              activity.ratings += 1;
              break;
          }
          
          updatedStats[activityIndex] = activity;
        }
        
        return updatedStats;
      });
    }, Math.floor(Math.random() * 5000) + 3000); // Random interval between 3-8 seconds
    
    // Fetch initial data
    fetchDashboardData();
    
    return () => {
      clearInterval(updateInterval);
    };
  }, [event.id]);
  
  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      // In a real implementation, you would fetch this data from your API
      // Here we'll use mock data as an example
      
      // Get user activities
      const mockActivities: UserActivity[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          type: 'poll',
          activityId: 'activity1',
          activityName: 'Keynote Session',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
          data: { question: 'How satisfied are you?', answer: 'Very satisfied' }
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          type: 'qa',
          activityId: 'activity1',
          activityName: 'Keynote Session',
          timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
          data: { question: 'When will the next release be available?' }
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Bob Johnson',
          type: 'checkin',
          activityId: 'activity2',
          activityName: 'Workshop Session',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
        }
      ];
      
      // Get overall stats
      const mockStats: EngagementStats = {
        totalUsers: 120,
        activeUsers: 78,
        totalInteractions: 342,
        avgRating: 4.2,
        pollParticipation: 67,
        qaParticipation: 45
      };
      
      // Get per-activity stats
      const mockActivityStats: ActivityStats[] = [
        {
          id: 'activity1',
          name: 'Keynote Session',
          attendees: 98,
          engagement: 210,
          ratings: 45,
          questions: 28
        },
        {
          id: 'activity2',
          name: 'Workshop Session',
          attendees: 42,
          engagement: 132,
          ratings: 38,
          questions: 17
        }
      ];
      
      setActivities(mockActivities);
      setStats(mockStats);
      setActivityStats(mockActivityStats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  
  // Format activity for display
  const formatActivity = (activity: UserActivity) => {
    switch (activity.type) {
      case 'view':
        return `viewed ${activity.activityName}`;
      case 'poll':
        return `answered a poll in ${activity.activityName}`;
      case 'qa':
        return `asked a question in ${activity.activityName}`;
      case 'chat':
        return `sent a message in ${activity.activityName}`;
      case 'rating':
        return `rated ${activity.activityName}`;
      case 'checkin':
        return `checked in to ${activity.activityName}`;
      default:
        return `interacted with ${activity.activityName}`;
    }
  };
  
  // Get icon for activity type
  const getActivityIcon = (type: UserActivity['type']) => {
    switch (type) {
      case 'view':
        return <Activity className="h-4 w-4" />;
      case 'poll':
        return <BarChart className="h-4 w-4" />;
      case 'qa':
        return <HelpCircle className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'rating':
        return <ThumbsUp className="h-4 w-4" />;
      case 'checkin':
        return <CheckCircle className="h-4 w-4" />;
    }
  };
  
  // Get badge color for activity type
  const getActivityColor = (type: UserActivity['type']) => {
    switch (type) {
      case 'view':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'poll':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'qa':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'chat':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rating':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'checkin':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${event.name} Dashboard`} />
      <div className="container mx-auto py-4">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{event.name} Dashboard</h1>
              <p className="text-muted-foreground">
                {format(new Date(event.start_date), 'MMMM d, yyyy')} - {format(new Date(event.end_date), 'MMMM d, yyyy')}
              </p>
            </div>
            <Button onClick={() => fetchDashboardData()}>Refresh Data</Button>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 font-medium">{stats.activeUsers} active now</span>
                  {' '} ({Math.round(stats.activeUsers / stats.totalUsers * 100)}%)
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{stats.totalInteractions}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
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
                  <ThumbsUp className="h-5 w-5 text-muted-foreground mr-2" />
                  <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}/5.0</div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{width: `${stats.avgRating / 5 * 100}%`}}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                        <div className="flex justify-between items-center">
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
                        
                        <Progress 
                          value={activity.engagement / Math.max(1, activity.attendees) * 50} 
                          className="h-2" 
                        />
                        
                        {selectedActivity === activity.id && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 p-2 bg-muted rounded-md">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Attendees</div>
                              <div className="font-medium">{activity.attendees}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Engagement</div>
                              <div className="font-medium">{activity.engagement}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Ratings</div>
                              <div className="font-medium">{activity.ratings}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Questions</div>
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
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Live Activity Stream</CardTitle>
                  <CardDescription>Real-time user activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {activities.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent activities to display
                      </div>
                    ) : (
                      activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b">
                          <Badge className={`${getActivityColor(activity.type)} flex items-center gap-1`}>
                            {getActivityIcon(activity.type)}
                            <span className="capitalize">{activity.type}</span>
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatActivity(activity)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => fetchDashboardData()}>
                    <Clock className="h-4 w-4 mr-2" />
                    Refresh Activity Feed
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Participation across different interaction types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Poll Participation</div>
                    <div className="text-sm text-muted-foreground">{stats.pollParticipation}/{stats.totalUsers}</div>
                  </div>
                  <Progress 
                    value={stats.pollParticipation / Math.max(1, stats.totalUsers) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Q&A Participation</div>
                    <div className="text-sm text-muted-foreground">{stats.qaParticipation}/{stats.totalUsers}</div>
                  </div>
                  <Progress 
                    value={stats.qaParticipation / Math.max(1, stats.totalUsers) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Rating Participation</div>
                    <div className="text-sm text-muted-foreground">{stats.avgRating > 0 ? 'Active' : 'None'}</div>
                  </div>
                  <Progress 
                    value={stats.avgRating / 5 * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Active Users</div>
                    <div className="text-sm text-muted-foreground">{stats.activeUsers}/{stats.totalUsers}</div>
                  </div>
                  <Progress 
                    value={stats.activeUsers / Math.max(1, stats.totalUsers) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Activity, BarChart, CheckCircle, HelpCircle, MessageSquare, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notification {
    title: string;
    description: string;
    attendee_name: string;
    timestamp: string;
    type: 'view' | 'poll' | 'qa' | 'feedback' | 'rating' | 'chat' | 'checkin' | 'report';
    event_id: number;
  }

// Extend Window interface to include Echo
declare global {
    interface Window {
        Echo: any;
    }
}
interface EventNotificationListenerProps {
    eventId?: number; // Optional event ID to filter notifications for a specific event
  }

export default function DashboardNotificationStream( {eventId} : EventNotificationListenerProps) {
    const { auth } = usePage().props as any;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [subscribedChannels, setSubscribedChannels] = useState<string[]>([]);
    
    useEffect(() => {
      // Make sure we have a user and Echo is initialized
      if (!auth?.user?.id) {
        setDebugInfo('User not authenticated');
        return;
      }
      
      if (!window.Echo) {
        setDebugInfo('Echo is not initialized');
        return;
      }
      
      const userId = auth.user.id;
      const echo = window.Echo;
      const channels: string[] = [];
      
      try {
        // Add connection status listeners
        echo.connector.pusher.connection.bind('connecting', () => {
          setConnectionStatus('connecting');
          setDebugInfo('Connecting to Pusher...');
        });
        
        echo.connector.pusher.connection.bind('connected', () => {
          setConnectionStatus('connected');
          setDebugInfo(`Connected to Pusher.`);
        });
        
        echo.connector.pusher.connection.bind('disconnected', () => {
          setConnectionStatus('disconnected');
          setDebugInfo('Disconnected from Pusher');
        });
        
        echo.connector.pusher.connection.bind('error', (err: any) => {
          setConnectionStatus('error');
          setDebugInfo(`Connection error: ${JSON.stringify(err)}`);
        });
        
        // If eventId is provided, subscribe to the specific event channel
        if (eventId) {
          const channelName = `user.${userId}.event.${eventId}`;
          setDebugInfo(`Subscribing to channel: ${channelName}`);
          
          const channel = echo.private(channelName);
          
          channel.listen('.event.notification', (data: Notification) => {
            console.log('Received notification:', data);
            setNotifications(prev => [data, ...prev]);
            setDebugInfo(`Received notification: ${data.title} (${data.type})`);
            
            // You could also show a toast notification here
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(data.title, {
                body: `${data.attendee_name}: ${data.description}`
              });
            }
          });
          
          channels.push(channelName);
        } else {
          // If no eventId is provided, subscribe to the user's general channel
          // This is kept for backward compatibility
          const channelName = `user.${userId}`;
          setDebugInfo(`Subscribing to channel: ${channelName}`);
          
          const channel = echo.private(channelName);
          
          channel.listen('.event.notification', (data: Notification) => {
            console.log('Received notification:', data);
            setNotifications(prev => [data, ...prev]);
            setDebugInfo(`Received notification: ${data.title} (${data.type})`);
            
            // You could also show a toast notification here
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(data.title, {
                body: `${data.attendee_name}: ${data.description}`
              });
            }
          });
          
          channels.push(channelName);
        }
        
        setSubscribedChannels(channels);
        
        return () => {
          // Clean up by leaving all subscribed channels
          channels.forEach(channelName => {
            if (echo && typeof echo.leave === 'function') {
              echo.leave(channelName);
            }
          });
        };
      } catch (error) {
        console.error('Error setting up Echo listener:', error);
        setDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`);
        setConnectionStatus('error');
      }
    }, [auth?.user?.id, eventId]);
    
    // Request notification permission on component mount
    useEffect(() => {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }, []);
    const toggleNotifications = () => {
        setShowNotifications((prev) => !prev);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    type Notification = {
        title: string;
        description: string;
        type: 'view' | 'poll' | 'qa' | 'chat' | 'rating' | 'checkin';
        attendee_name: string;
        timestamp: Date;
    };

    // Get icon for activity type
    const getNotificationIcon = (type: Notification['type']) => {
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
    const getNotificationColor = (type: Notification['type']) => {
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

    // Render a notification bell with a dropdown
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Live Activity Stream</CardTitle>
                <CardDescription>Real-time user activities</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-h-[400px] space-y-4 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center">No recent activities to display</div>
                    ) : (
                        notifications.map((notification, index) => (
                            <div key={index} className="flex items-start space-x-3 border-b pb-3">
                                <Badge className={`flex items-center px-2 py-1 rounded-full text-xs ${getNotificationColor(notification.type)} min-w-[80px] justify-center`}>
                                    {getNotificationIcon(notification.type)}
                                    <span className="capitalize">{notification.type}</span>
                                </Badge>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">{notification.attendee_name || '-'}</p>
                                    <p className="text-muted-foreground text-sm">{notification.description || '-'}</p>
                                    <p className="text-muted-foreground text-xs">{format(new Date(notification.timestamp), 'MMM d, h:mm a')}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

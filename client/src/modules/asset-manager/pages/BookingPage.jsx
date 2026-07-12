import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Clock, Users, MapPin, Calendar as CalendarIcon, 
  X, Plus, ChevronRight, AlertCircle, Edit, Trash2, Box, CalendarClock, User
} from 'lucide-react';
import { DashboardCard } from '../components/dashboard';
import { Button, Badge, Input, Select, Label, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
    'UPCOMING': 'success',
    'ONGOING': 'success',
    'PENDING': 'warning',
    'CONFLICT': 'danger',
    'COMPLETED': 'neutral',
    'CANCELLED': 'neutral',
  };
  return <Badge variant={variantMap[status] || 'neutral'}>{status}</Badge>;
};


const BookingPage = () => {
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
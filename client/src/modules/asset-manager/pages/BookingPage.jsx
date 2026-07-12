import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Clock, Users, MapPin, Calendar as CalendarIcon, 
  X, Plus, ChevronRight, AlertCircle, Edit, Trash2, Box, CalendarClock, User
} from 'lucide-react';
import { DashboardCard } from '../components/dashboard';
import { Button, Badge, Input, Select, Label, Card, CardContent, CardHeader, CardTitle } from '../components/ui';

// Setup localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const BookingStatusBadge = ({ status }) => {
  const variantMap = {
    'Confirmed': 'success',
    'Pending': 'warning',
    'Conflict': 'danger',
    'Completed': 'neutral',
  };
  return <Badge variant={variantMap[status] || 'neutral'}>{status}</Badge>;
};

// Placeholder Data
const EVENTS = [
  {
    id: 1,
    title: 'Marketing Pitch - Conf Projector A',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    status: 'Confirmed',
    user: 'Sarah Jenkins',
    type: 'booked',
    desc: 'Using the main projector for Q3 marketing pitch.'
  },
  {
    id: 2,
    title: 'Monthly Review (CONFLICT)',
    start: new Date(new Date().setHours(11, 30, 0, 0)),
    end: new Date(new Date().setHours(13, 0, 0, 0)),
    status: 'Conflict',
    user: 'Mike Ross',
    type: 'conflict',
    desc: 'Requested projector but slot is overlapping with Marketing.'
  },
  {
    id: 3,
    title: 'Available Slot - Drone Kit',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(16, 0, 0, 0)),
    type: 'available',
    desc: 'Standard maintenance window cleared.'
  }
];

const UPCOMING_BOOKINGS = [
  { id: 10, resource: 'Conference Projector A', user: 'Sarah Jenkins', time: 'Today, 10:00 AM - 12:00 PM', status: 'Confirmed' },
  { id: 11, resource: 'Sony A7IV Camera Kit', user: 'Alex Chen', time: 'Tomorrow, 09:00 AM - 05:00 PM', status: 'Pending' },
  { id: 12, resource: 'Conference Projector A', user: 'Mike Ross', time: 'Today, 11:30 AM - 01:00 PM', status: 'Conflict' }
];


const BookingPage = () => {
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Custom Event Styling
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6'; // default blue
    let borderLeft = '4px solid #1d4ed8';

    if (event.type === 'conflict') {
      backgroundColor = '#fee2e2'; // red-100
      borderLeft = '4px solid #ef4444'; // red-500
    } else if (event.type === 'available') {
      backgroundColor = '#f1f5f9'; // slate-100
      borderLeft = '4px solid #94a3b8'; // slate-400
    } else if (event.type === 'booked') {
      backgroundColor = '#dbeafe'; // blue-100
      borderLeft = '4px solid #3b82f6'; // blue-500
    }

    return {
      style: {
        backgroundColor,
        borderLeft,
        borderRadius: '4px',
        opacity: 0.9,
        color: event.type === 'conflict' ? '#991b1b' : (event.type === 'available' ? '#475569' : '#1e3a8a'),
        border: 'none',
        borderLeftWidth: '4px',
        display: 'block',
        fontWeight: '600',
        fontSize: '12px',
        padding: '2px 6px'
      }
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleSelectSlot = (slotInfo) => {
    setIsBookDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Booking</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage reservations, resolve conflicts, and schedule asset usage.</p>
        </div>
        <Button onClick={() => setIsBookDialogOpen(true)} className="gap-2">
          <Plus size={16} />
          Book Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Calendar View (Spans 3 cols on large screens) */}
        <div className="xl:col-span-3">
          <DashboardCard title="Booking Calendar">
            {/* Custom CSS classes applied via standard react-big-calendar import above */}
            <div className="h-[600px] bg-white rounded-lg overflow-hidden font-sans text-sm">
              <Calendar
                localizer={localizer}
                events={EVENTS}
                startAccessor="start"
                endAccessor="end"
                defaultView={Views.WEEK}
                views={['month', 'week', 'day']}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                step={30}
                timeslots={2}
                min={new Date(0, 0, 0, 8, 0, 0)} // Start at 8 AM
                max={new Date(0, 0, 0, 19, 0, 0)} // End at 7 PM
                className="border-none shadow-none"
              />
            </div>
            
            {/* Legend */}
            <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border-l-2 border-blue-500 rounded-sm"></div>
                Booked Slot
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border-l-2 border-red-500 rounded-sm"></div>
                Conflict Slot
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-100 border-l-2 border-slate-400 rounded-sm"></div>
                Available Slot
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Right Sidebar - Upcoming & Details */}
        <div className="space-y-6">
          
          {/* Selected Booking Details */}
          {selectedEvent && selectedEvent.type !== 'available' && (
            <Card className="border-blue-200 shadow-md ring-1 ring-blue-50">
              <CardHeader className="bg-blue-50/50 py-3 flex flex-row items-center justify-between border-b border-blue-100">
                <CardTitle className="text-blue-900 text-sm">Booking Details</CardTitle>
                <button onClick={() => setSelectedEvent(null)} className="text-blue-400 hover:text-blue-700"><X size={16}/></button>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-bold text-slate-900 text-sm">{selectedEvent.title}</p>
                    <BookingStatusBadge status={selectedEvent.status} />
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-2">{selectedEvent.desc}</p>
                </div>
                
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <User size={14} className="text-slate-400" />
                    <span>{selectedEvent.user}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Clock size={14} className="text-slate-400" />
                    <span>{moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsRescheduleDialogOpen(true)}
                    className="flex-1 gap-1.5"
                  >
                    <Edit size={14} /> Reschedule
                  </Button>
                  <Button variant="danger" size="sm" className="gap-1.5">
                    <Trash2 size={14} /> Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Bookings Cards */}
          <DashboardCard title="Upcoming Bookings">
            <div className="space-y-3">
              {UPCOMING_BOOKINGS.map(booking => (
                <div key={booking.id} className="p-3 border border-slate-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm transition-all cursor-pointer group bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">{booking.resource}</p>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <User size={12} className="text-slate-400" />
                      {booking.user}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Clock size={12} className="text-slate-400" />
                      {booking.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 gap-1 text-blue-600">
              View All Bookings <ChevronRight size={14} />
            </Button>
          </DashboardCard>
        </div>
      </div>

      {/* Book Resource Dialog (Simplified for UI Preview) */}
      {isBookDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Book a Resource</h3>
              <button onClick={() => setIsBookDialogOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-md transition-colors"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Select Resource *</Label>
                <Select>
                  <option>Conference Projector A</option>
                  <option>Sony A7IV Camera Kit</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Start Date & Time</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date & Time</Label>
                  <Input type="datetime-local" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Purpose / Notes</Label>
                <textarea rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
              </div>
            </div>
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsBookDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsBookDialogOpen(false)}>Confirm Booking</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Dialog (Simplified) */}
      {isRescheduleDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-blue-100 flex justify-between items-center bg-blue-50">
              <h3 className="font-bold text-blue-900">Reschedule Booking</h3>
              <button onClick={() => setIsRescheduleDialogOpen(false)} className="text-blue-400 hover:text-blue-700 hover:bg-blue-100 p-1 rounded-md transition-colors"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs font-semibold text-amber-800">You are requesting to move an already confirmed booking. The new slot must be available.</p>
              </div>
              <div className="space-y-1.5">
                <Label>New Start</Label>
                <Input type="datetime-local" />
              </div>
              <div className="space-y-1.5">
                <Label>New End</Label>
                <Input type="datetime-local" />
              </div>
            </div>
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsRescheduleDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsRescheduleDialogOpen(false)}>Submit Request</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

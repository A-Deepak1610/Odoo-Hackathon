import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Clock, Users, MapPin, Calendar as CalendarIcon, 
  X, Plus, ChevronRight, AlertCircle, Edit, Trash2, Box, CalendarClock
} from 'lucide-react';
import { DashboardCard } from '../components';

// Setup localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Small custom Badge component requested
const BookingStatusBadge = ({ status }) => {
  const statusConfig = {
    'Confirmed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Conflict': 'bg-red-100 text-red-700 border-red-200',
    'Completed': 'bg-slate-100 text-slate-700 border-slate-200',
  };
  const configClass = statusConfig[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-md border ${configClass}`}>
      {status}
    </span>
  );
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
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Resource Booking</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage reservations, resolve conflicts, and schedule asset usage.</p>
        </div>
        <button 
          onClick={() => setIsBookDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <Plus size={16} />
          Book Resource
        </button>
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
            <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
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
            <div className="bg-white rounded-xl border border-blue-200 shadow-md overflow-hidden ring-1 ring-blue-50">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
                <h3 className="font-bold text-blue-900 text-sm">Booking Details</h3>
                <button onClick={() => setSelectedEvent(null)} className="text-blue-400 hover:text-blue-700"><X size={16}/></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-slate-800 text-sm">{selectedEvent.title}</p>
                    <BookingStatusBadge status={selectedEvent.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{selectedEvent.desc}</p>
                </div>
                
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User size={14} className="text-slate-400" />
                    <span className="font-medium">{selectedEvent.user}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={14} className="text-slate-400" />
                    <span>{moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setIsRescheduleDialogOpen(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <Edit size={14} /> Reschedule
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded text-xs font-semibold hover:bg-red-50 transition-colors">
                    <Trash2 size={14} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Bookings Cards */}
          <DashboardCard title="Upcoming Bookings">
            <div className="space-y-3">
              {UPCOMING_BOOKINGS.map(booking => (
                <div key={booking.id} className="p-3 border border-slate-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm text-slate-800 group-hover:text-blue-700 transition-colors">{booking.resource}</p>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User size={12} className="text-slate-400" />
                      {booking.user}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={12} className="text-slate-400" />
                      {booking.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
              View All Bookings <ChevronRight size={14} />
            </button>
          </DashboardCard>
        </div>
      </div>

      {/* Book Resource Dialog (Simplified for UI Preview) */}
      {isBookDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Book a Resource</h3>
              <button onClick={() => setIsBookDialogOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Resource *</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>Conference Projector A</option>
                  <option>Sony A7IV Camera Kit</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Start Date & Time</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">End Date & Time</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Purpose / Notes</label>
                <textarea rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setIsBookDialogOpen(false)} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => setIsBookDialogOpen(false)} className="px-5 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Dialog (Simplified) */}
      {isRescheduleDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50">
              <h3 className="font-bold text-blue-900">Reschedule Booking</h3>
              <button onClick={() => setIsRescheduleDialogOpen(false)} className="text-blue-400 hover:text-blue-600"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-amber-800">You are requesting to move an already confirmed booking. The new slot must be available.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">New Start</label>
                <input type="datetime-local" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">New End</label>
                <input type="datetime-local" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setIsRescheduleDialogOpen(false)} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => setIsRescheduleDialogOpen(false)} className="px-5 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

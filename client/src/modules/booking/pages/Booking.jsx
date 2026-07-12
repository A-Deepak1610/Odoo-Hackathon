import React from 'react';
import { CalendarClock, Plus, Clock } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import StatusPill from '../../../shared/components/StatusPill';
import Button from '../../../shared/components/Button';

const mockBookings = [
  { id: 'BK-001', resource: 'Conf Room A', user: 'Tom Hanks', time: '10:00 AM - 11:30 AM', date: 'Today', status: 'Ongoing' },
  { id: 'BK-002', resource: 'Projector A1', user: 'Mike Ross', time: '2:00 PM - 4:00 PM', date: 'Today', status: 'Upcoming' },
  { id: 'BK-003', resource: 'Delivery Van #2', user: 'Logistics', time: '9:00 AM - 5:00 PM', date: 'Tomorrow', status: 'Upcoming' },
  { id: 'BK-004', resource: 'Conf Room B', user: 'Sarah Jenkins', time: '9:00 AM - 10:00 AM', date: 'Yesterday', status: 'Completed' },
  { id: 'BK-005', resource: 'DSLR Camera', user: 'Marketing Team', time: '1:00 PM - 3:00 PM', date: 'Yesterday', status: 'Cancelled' },
];

const Booking = () => {
  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Resource Booking" 
        description="Schedule and manage bookings for shared assets and facilities."
        actions={<Button icon={Plus}>Book Resource</Button>}
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CalendarClock size={18} className="text-gray-400" />
            Booking Slots
          </h3>
          <div className="flex gap-2">
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none">
              <option>All Resources</option>
              <option>Rooms</option>
              <option>Vehicles</option>
              <option>Equipment</option>
            </select>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {mockBookings.map((booking) => (
            <div key={booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex flex-col items-center justify-center text-primary-700 shrink-0">
                  <span className="text-xs font-semibold uppercase">{booking.date === 'Today' || booking.date === 'Tomorrow' ? booking.date.slice(0, 3) : 'Oct'}</span>
                  <span className="text-lg font-bold leading-none">{booking.date === 'Today' ? '12' : booking.date === 'Tomorrow' ? '13' : '11'}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{booking.resource}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {booking.time}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>{booking.user}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <StatusPill status={booking.status} />
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700">Manage</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Booking;

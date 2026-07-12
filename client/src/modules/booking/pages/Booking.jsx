import React, { useState } from 'react';
import { CalendarClock, Plus, Clock, Filter, CheckCircle2, XCircle } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import StatCard from '../../../shared/components/StatCard';
import Button from '../../../shared/components/Button';
import Modal from '../../../shared/components/Modal';
import StatusPill from '../../../shared/components/StatusPill';

// --- MOCK DATA ---
const initialBookings = [
  { id: 'BK-001', resource: 'Conf Room A', user: 'Tom Hanks', time: '10:00 AM - 11:30 AM', date: 'Today', dateNum: '12', status: 'Ongoing', type: 'Rooms' },
  { id: 'BK-002', resource: 'Projector A1', user: 'Mike Ross', time: '2:00 PM - 4:00 PM', date: 'Today', dateNum: '12', status: 'Upcoming', type: 'Equipment' },
  { id: 'BK-003', resource: 'Delivery Van #2', user: 'Logistics', time: '9:00 AM - 5:00 PM', date: 'Tomorrow', dateNum: '13', status: 'Upcoming', type: 'Vehicles' },
  { id: 'BK-004', resource: 'Conf Room B', user: 'Sarah Jenkins', time: '9:00 AM - 10:00 AM', date: 'Yesterday', dateNum: '11', status: 'Completed', type: 'Rooms' },
];

const Booking = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [typeFilter, setTypeFilter] = useState('All Resources');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    resource: '', user: '', time: '10:00 AM - 11:00 AM', date: 'Tomorrow', dateNum: '13', type: 'Rooms', status: 'Upcoming'
  });

  // Derived Stats
  const totalBookings = bookings.length;
  const ongoingCount = bookings.filter(b => b.status === 'Ongoing').length;
  const upcomingCount = bookings.filter(b => b.status === 'Upcoming').length;
  
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const completionRate = totalBookings > 0 ? Math.round((completedCount / (completedCount + ongoingCount + upcomingCount)) * 100) : 100;

  // Filtering
  const filteredBookings = bookings.filter(b => typeFilter === 'All Resources' || b.type === typeFilter);

  // Actions
  const handleOpenModal = () => {
    setFormData({ resource: '', user: '', time: '10:00 AM - 11:00 AM', date: 'Tomorrow', dateNum: '13', type: 'Rooms', status: 'Upcoming' });
    setIsModalOpen(true);
  };

  const handleSaveBooking = () => {
    const newBooking = {
      ...formData,
      id: `BK-00${bookings.length + 1}`
    };
    setBookings([newBooking, ...bookings]);
    setIsModalOpen(false);
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto font-sans">
      <PageHeader 
        title="Resource Booking" 
        description="Schedule and manage bookings for shared assets and facilities."
        actions={<Button onClick={handleOpenModal} icon={Plus}>Book Resource</Button>}
      />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Bookings" value={totalBookings} subtitle="Active this month" color="indigo" icon={CalendarClock} />
        <StatCard title="Ongoing" value={ongoingCount} subtitle="Right now" color="blue" icon={CalendarClock} />
        <StatCard title="Upcoming" value={upcomingCount} subtitle="Next 7 days" color="purple" icon={CalendarClock} />
        <StatCard title="Completion" value={`${completionRate}%`} subtitle="On-time rate" color="emerald" icon={CheckCircle2} />
      </div>

      {/* BOOKING LIST */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <CalendarClock size={16} className="text-primary-700" />
            Booking Slots
          </h3>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select 
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:ring-primary-500 outline-none cursor-pointer"
            >
              <option>All Resources</option>
              <option>Rooms</option>
              <option>Vehicles</option>
              <option>Equipment</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No bookings found.</div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors">
                
                <div className="flex items-center gap-4 flex-1">
                  {/* Calendar Box */}
                  <div className="w-12 h-12 rounded-lg bg-primary-50 border border-primary-100 flex flex-col items-center justify-center shrink-0">
                    <div className="text-[10px] font-bold text-primary-700 uppercase">{booking.date.slice(0, 3)}</div>
                    <div className="text-lg font-bold text-primary-700 leading-none mt-0.5">{booking.dateNum}</div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{booking.resource}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" />
                        {booking.time}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-gray-600">{booking.user}</span>
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{booking.type}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                  <StatusPill status={booking.status} />
                  
                  <div className="flex items-center gap-1 min-w-[120px] justify-end">
                    {(booking.status === 'Upcoming' || booking.status === 'Ongoing') && (
                      <>
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'Completed')}
                          title="Mark Completed"
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                          title="Cancel Booking"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ADD BOOKING MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book a Resource"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBooking}>Confirm Booking</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-primary-500 outline-none"
            >
              <option>Rooms</option>
              <option>Vehicles</option>
              <option>Equipment</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
            <input 
              value={formData.resource} 
              onChange={e => setFormData({...formData, resource: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none" 
              placeholder="e.g. Conf Room A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User / Department</label>
            <input 
              value={formData.user} 
              onChange={e => setFormData({...formData, user: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none" 
              placeholder="e.g. Marketing Team"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date"
                onChange={e => {
                  const d = new Date(e.target.value);
                  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  setFormData({
                    ...formData, 
                    date: days[d.getDay()] || 'Day',
                    dateNum: d.getDate().toString() || '00'
                  });
                }} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none text-gray-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Block</label>
              <input 
                value={formData.time} 
                onChange={e => setFormData({...formData, time: e.target.value})} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none" 
                placeholder="10:00 AM - 11:00 AM"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;

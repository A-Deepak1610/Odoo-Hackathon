import React, { useState } from 'react';
import { Calendar, Clock, Monitor, Presentation, Wifi, MapPin } from 'lucide-react';
import Button from '../../../shared/components/Button';
import { useDeptHead } from '../store/DeptHeadContext';

const ResourceBooking = () => {
  const { resources, bookResource } = useDeptHead();
  const [selectedResource, setSelectedResource] = useState(null);
  const [filterType, setFilterType] = useState('All Types');
  
  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedResource || !date || !startTime || !endTime) return;
    
    bookResource(selectedResource.id, purpose, date, startTime, endTime);
    
    // Reset Form
    setSelectedResource(null);
    setDate('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
  };

  const filteredResources = resources.filter(res => {
    if (filterType === 'All Types') return true;
    if (filterType === 'Rooms') return res.type === 'Room';
    if (filterType === 'Equipment') return res.type === 'Equipment';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Booking</h1>
        <p className="text-sm text-slate-500 mt-1">Book shared facilities and equipment for your department.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Resource List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Available Resources</h2>
            <div className="flex gap-2">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-600"
              >
                <option>All Types</option>
                <option>Rooms</option>
                <option>Equipment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map(res => (
              <div 
                key={res.id} 
                onClick={() => res.status === 'Available' && setSelectedResource(res)}
                className={`bg-white rounded-xl border p-5 transition-all ${
                  res.status === 'Available' ? 'cursor-pointer hover:shadow-md hover:border-primary-300' : 'opacity-75 cursor-not-allowed border-slate-200'
                } ${selectedResource?.id === res.id ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50/30' : 'border-slate-200'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      {res.type === 'Room' ? <MapPin size={20} /> : <Monitor size={20} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{res.name}</h3>
                      <p className="text-xs text-slate-500">{res.type}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    res.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {res.status}
                  </span>
                </div>
                
                {res.capacity && (
                  <p className="text-sm text-slate-600 mb-2">Capacity: {res.capacity} people</p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {res.amenities.map(item => (
                    <span key={item} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Book Resource</h2>
            
            {selectedResource ? (
              <form className="space-y-4" onSubmit={handleBooking}>
                <div className="p-3 bg-primary-50 text-primary-800 rounded-lg border border-primary-100 mb-6">
                  <p className="text-sm font-medium">Selected: {selectedResource.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="time" 
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="time" 
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                  <textarea 
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Brief description of usage..."
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors">
                  Confirm Booking
                </Button>
              </form>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Presentation className="mx-auto text-slate-300 mb-3" size={32} />
                <p className="text-sm text-slate-500 font-medium">Select an available resource from the list to book it.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceBooking;

import React, { useState } from 'react';
import { 
  Plus, MoreHorizontal, AlertCircle, Wrench, Clock, Paperclip, 
  MessageSquare, User, X, CheckCircle2, ChevronRight
} from 'lucide-react';
import { ActivityCard } from '../components/dashboard';
import { Button, Badge } from '../components/ui';

// Placeholder Data
const COLUMNS = [
  { id: 'pending', title: 'Pending Approval', color: 'border-slate-300', bg: 'bg-slate-100' },
  { id: 'approved', title: 'Approved', color: 'border-blue-300', bg: 'bg-blue-50' },
  { id: 'assigned', title: 'Technician Assigned', color: 'border-purple-300', bg: 'bg-purple-50' },
  { id: 'in_progress', title: 'In Progress', color: 'border-amber-300', bg: 'bg-amber-50' },
  { id: 'resolved', title: 'Resolved', color: 'border-emerald-300', bg: 'bg-emerald-50' }
];

const MOCK_TICKETS = [
  {
    id: 'TKT-1029',
    asset: 'Dell UltraSharp 32"',
    assetTag: 'AST-2024-002',
    issue: 'Screen flickering intermittently after 2 hours of use.',
    priority: 'Medium',
    status: 'pending',
    requester: 'John Doe',
    technician: null,
    attachments: 1,
    comments: 0,
    date: 'Oct 24, 2024'
  },
  {
    id: 'TKT-1030',
    asset: 'Conference Projector A',
    assetTag: 'AST-2024-005',
    issue: 'Lamp replacement required. Brightness is very low.',
    priority: 'High',
    status: 'approved',
    requester: 'Marketing Dept',
    technician: null,
    attachments: 0,
    comments: 2,
    date: 'Oct 23, 2024'
  },
  {
    id: 'TKT-1031',
    asset: 'Herman Miller Chair',
    assetTag: 'AST-2024-003',
    issue: 'Right armrest is loose and wobbling.',
    priority: 'Low',
    status: 'assigned',
    requester: 'Sarah Jenkins',
    technician: 'Mike Fixer',
    attachments: 2,
    comments: 1,
    date: 'Oct 22, 2024'
  },
  {
    id: 'TKT-1032',
    asset: 'HVAC Unit - Floor 2',
    assetTag: 'AST-2023-145',
    issue: 'Leaking water near the server room entrance.',
    priority: 'High',
    status: 'in_progress',
    requester: 'Facilities',
    technician: 'External Vendor',
    attachments: 3,
    comments: 5,
    date: 'Oct 21, 2024'
  },
  {
    id: 'TKT-1028',
    asset: 'MacBook Pro 16"',
    assetTag: 'AST-2024-001',
    issue: 'Battery swelling issue reported by user.',
    priority: 'High',
    status: 'resolved',
    requester: 'Alex Chen',
    technician: 'IT Hardware Team',
    attachments: 1,
    comments: 3,
    date: 'Oct 20, 2024'
  }
];

const PriorityBadge = ({ priority }) => {
  const variantMap = {
    'High': 'danger',
    'Medium': 'warning',
    'Low': 'info'
  };
  
  return (
    <Badge variant={variantMap[priority] || 'neutral'}>
      {priority}
    </Badge>
  );
};


const MaintenancePage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Maintenance & Repairs</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track and manage asset maintenance requests through the Kanban board.</p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => setIsLogModalOpen(true)}>
          <Plus size={16} />
          Log Maintenance
        </Button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-6 h-full items-start w-max pb-4">
          
          {COLUMNS.map(column => (
            <div key={column.id} className="w-[340px] flex flex-col max-h-full bg-slate-100/50 rounded-xl border border-slate-200 shadow-sm">
              
              {/* Column Header */}
              <div className={`px-4 py-3.5 border-b-2 ${column.color} flex justify-between items-center bg-white rounded-t-xl`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{column.title}</h3>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200">
                    {MOCK_TICKETS.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-700 hover:bg-slate-50 p-1 rounded transition-colors"><MoreHorizontal size={16}/></button>
              </div>

              {/* Column Cards */}
              <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                {MOCK_TICKETS.filter(t => t.status === column.id).map(ticket => (
                  
                  <div 
                    key={ticket.id} 
                    onClick={() => setSelectedTicket(ticket)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{ticket.id}</span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    
                    <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">{ticket.asset}</h4>
                    <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-3 leading-relaxed">{ticket.issue}</p>
                    
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50/80 px-2.5 py-1.5 rounded-md mb-3 border border-slate-100">
                      <User size={12} className="text-slate-400" />
                      {ticket.technician ? ticket.technician : <span className="text-slate-400 font-medium italic">Unassigned</span>}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-3">
                        {ticket.attachments > 0 && (
                          <div className="flex items-center gap-1 hover:text-slate-600">
                            <Paperclip size={12} /> {ticket.attachments}
                          </div>
                        )}
                        {ticket.comments > 0 && (
                          <div className="flex items-center gap-1 hover:text-slate-600">
                            <MessageSquare size={12} /> {ticket.comments}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} /> {ticket.date}
                      </div>
                    </div>
                  </div>

                ))}
                
                {/* Empty State for Column */}
                {MOCK_TICKETS.filter(t => t.status === column.id).length === 0 && (
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-400">No tickets in this column</p>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Request Details Drawer (Overlay) */}
      {selectedTicket && (
        <div className="absolute inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-opacity animate-in fade-in"
            onClick={() => setSelectedTicket(null)}
          ></div>
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300 z-10">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedTicket(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"><ChevronRight size={20}/></button>
                <h3 className="font-bold text-slate-900 text-lg">{selectedTicket.id}</h3>
              </div>
              <PriorityBadge priority={selectedTicket.priority} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
              
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Asset Information</h4>
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <div>
                    <p className="font-bold text-blue-900 text-sm">{selectedTicket.asset}</p>
                    <p className="text-xs text-blue-600 font-mono font-medium mt-0.5">{selectedTicket.assetTag}</p>
                  </div>
                  <ChevronRight size={16} className="text-blue-400" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Issue Description</h4>
                <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {selectedTicket.issue}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Requester</h4>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <User size={14} className="text-slate-400" />
                    {selectedTicket.requester}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Tech</h4>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Wrench size={14} className="text-slate-400" />
                    {selectedTicket.technician || <span className="text-slate-400 font-medium italic">Unassigned</span>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Attachments ({selectedTicket.attachments})</h4>
                {selectedTicket.attachments > 0 ? (
                   <div className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-200 cursor-pointer transition-colors group">
                     <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors border border-blue-100">
                       <Paperclip size={16} />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-900">issue_screenshot.jpg</p>
                       <p className="text-xs font-medium text-slate-500 mt-0.5">1.2 MB</p>
                     </div>
                   </div>
                ) : (
                  <p className="text-sm font-medium text-slate-400 italic">No attachments provided.</p>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Ticket Timeline</h4>
                <div className="pt-2">
                  {selectedTicket.status === 'resolved' && (
                    <ActivityCard 
                      title="Ticket Resolved"
                      description="Technician marked the issue as fixed."
                      timestamp="Oct 20"
                      icon={CheckCircle2}
                      iconColor="emerald"
                    />
                  )}
                  {(selectedTicket.status === 'in_progress' || selectedTicket.status === 'resolved') && (
                    <ActivityCard 
                      title="Work Started"
                      description="Technician began diagnostics."
                      timestamp="Oct 19"
                      icon={Wrench}
                      iconColor="amber"
                    />
                  )}
                  {(selectedTicket.status === 'assigned' || selectedTicket.status === 'in_progress' || selectedTicket.status === 'resolved') && (
                    <ActivityCard 
                      title="Technician Assigned"
                      description={`${selectedTicket.technician || 'IT Support'} assigned to ticket.`}
                      timestamp="Oct 18"
                      icon={User}
                      iconColor="purple"
                    />
                  )}
                  <ActivityCard 
                    title="Maintenance Request Approved"
                    description="Approved by Department Head."
                    timestamp="Oct 18"
                    icon={CheckCircle2}
                    iconColor="blue"
                  />
                  <ActivityCard 
                    title="Ticket Created"
                    description={`Submitted by ${selectedTicket.requester}.`}
                    timestamp="Oct 18"
                    icon={AlertCircle}
                    iconColor="slate"
                  />
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 shrink-0">
              <Button className="w-full">
                Update Ticket Status
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Log Maintenance Dialog */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">Log Maintenance Request</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1 rounded-md transition-colors"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Asset</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>Select an asset...</option>
                  <option>MacBook Pro 16" (AST-2024-001)</option>
                  <option>Dell UltraSharp 32" (AST-2024-002)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Priority</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>Low - Routine Check</option>
                  <option>Medium - Minor Issue</option>
                  <option>High - Urgent Repair</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Issue Description</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe the issue or reason for maintenance..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsLogModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenancePage;

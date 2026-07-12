import React, { useState } from 'react';
import { Wrench, Plus, ChevronRight, Activity } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import StatCard from '../../../shared/components/StatCard';
import Button from '../../../shared/components/Button';
import Modal from '../../../shared/components/Modal';
import StatusPill from '../../../shared/components/StatusPill';

// --- MOCK DATA ---
const initialMaintenance = [
  { id: 'MNT-4021', asset: 'HVAC System Unit B', issue: 'Not cooling properly', reportedBy: 'Facilities', priority: 'High', stage: 'In Progress', progress: 60 },
  { id: 'MNT-4022', asset: 'Delivery Van #4', issue: 'Brake pad replacement', reportedBy: 'Logistics', priority: 'Medium', stage: 'Technician Assigned', progress: 40 },
  { id: 'MNT-4023', asset: 'Projector A1', issue: 'Bulb burned out', reportedBy: 'Marketing', priority: 'Low', stage: 'Pending', progress: 20 },
  { id: 'MNT-4024', asset: 'MacBook Pro 16"', issue: 'Keyboard keys sticky', reportedBy: 'Sarah Jenkins', priority: 'Medium', stage: 'Resolved', progress: 100 },
];

const Maintenance = () => {
  const [requests, setRequests] = useState(initialMaintenance);
  
  // Modal State
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  // Forms
  const [raiseForm, setRaiseForm] = useState({
    asset: '', issue: '', reportedBy: '', priority: 'Medium'
  });
  const [updateForm, setUpdateForm] = useState(null);

  // Stats Calculation
  const totalRequests = requests.length;
  const inProgressCount = requests.filter(r => r.stage === 'In Progress' || r.stage === 'Technician Assigned').length;
  const resolvedCount = requests.filter(r => r.stage === 'Resolved').length;

  // Actions
  const handleRaiseSubmit = () => {
    const newReq = {
      ...raiseForm,
      id: `MNT-${4000 + requests.length + 1}`,
      stage: 'Pending',
      progress: 0,
    };
    setRequests([newReq, ...requests]);
    setIsRaiseModalOpen(false);
    setRaiseForm({ asset: '', issue: '', reportedBy: '', priority: 'Medium' });
  };

  const openUpdateModal = (req) => {
    setUpdateForm({ ...req });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = () => {
    setRequests(requests.map(r => r.id === updateForm.id ? updateForm : r));
    setIsUpdateModalOpen(false);
  };

  // Helpers
  const getPriorityStyle = (priority) => {
    if (priority === 'High') return 'bg-red-50 text-red-600';
    if (priority === 'Medium') return 'bg-amber-50 text-amber-600';
    return 'bg-green-50 text-green-700';
  };

  const getStageStyle = (stage) => {
    if (stage === 'In Progress') return 'bg-amber-50 text-amber-600';
    if (stage === 'Resolved') return 'bg-green-50 text-green-700';
    if (stage === 'Technician Assigned') return 'bg-blue-50 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto font-sans">
      <PageHeader 
        title="Maintenance Requests" 
        description="Track repair requests, assign technicians, and monitor maintenance workflows."
        actions={<Button onClick={() => setIsRaiseModalOpen(true)} icon={Plus}>Raise Request</Button>}
      />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Requests" value={totalRequests} subtitle="This month" color="indigo" icon={Wrench} />
        <StatCard title="In Progress" value={inProgressCount} subtitle="Being worked on" color="amber" icon={Activity} />
        <StatCard title="Resolved" value={resolvedCount} subtitle="Successfully fixed" color="emerald" icon={Wrench} />
        <StatCard title="Avg. Time" value="2.3d" subtitle="Days to resolve" color="purple" icon={Wrench} />
      </div>

      {/* MAINTENANCE CARDS LIST */}
      <div className="flex flex-col gap-3">
        {requests.map((req) => (
          <div 
            key={req.id} 
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-primary-700 hover:shadow-md transition-all group"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-5 items-start">
              
              {/* Left: Asset & Issue */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-mono text-primary-800 font-semibold">{req.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStageStyle(req.stage)}`}>
                    {req.stage}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{req.asset}</h3>
                <p className="text-[13px] text-gray-500 mb-1.5">{req.issue}</p>
                <p className="text-[11px] text-gray-400 m-0">Reported by {req.reportedBy}</p>
              </div>

              {/* Center: Priority & Progress */}
              <div className="flex flex-col justify-center h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getPriorityStyle(req.priority)}`}>
                    {req.priority} Priority
                  </span>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold mb-1">
                    Workflow Progress: {req.progress}%
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${req.progress === 100 ? 'bg-emerald-500' : 'bg-primary-700'}`}
                      style={{ width: `${req.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Action */}
              <div className="flex items-center justify-center h-full">
                <button 
                  onClick={() => openUpdateModal(req)}
                  className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 transition-all group-hover:bg-primary-50 group-hover:border-primary-700 group-hover:text-primary-700 hover:!bg-primary-100"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- RAISE REQUEST MODAL --- */}
      <Modal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
        title="Raise Maintenance Request"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsRaiseModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRaiseSubmit}>Submit Request</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name / Tag</label>
            <input 
              value={raiseForm.asset} 
              onChange={e => setRaiseForm({...raiseForm, asset: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none" 
              placeholder="e.g. HVAC System Unit B"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
            <textarea 
              value={raiseForm.issue} 
              onChange={e => setRaiseForm({...raiseForm, issue: e.target.value})} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none h-20 resize-none" 
              placeholder="Describe the problem..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
              <input 
                value={raiseForm.reportedBy} 
                onChange={e => setRaiseForm({...raiseForm, reportedBy: e.target.value})} 
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 outline-none" 
                placeholder="Name or Dept"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                value={raiseForm.priority} 
                onChange={e => setRaiseForm({...raiseForm, priority: e.target.value})} 
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-primary-500 outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* --- UPDATE REQUEST MODAL --- */}
      {updateForm && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Request ${updateForm.id}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateSubmit}>Save Changes</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mb-4">
              <p className="text-sm font-semibold text-gray-900">{updateForm.asset}</p>
              <p className="text-xs text-gray-500">{updateForm.issue}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select 
                value={updateForm.stage} 
                onChange={e => {
                  const newStage = e.target.value;
                  let newProgress = updateForm.progress;
                  // Auto-update progress based on stage selection
                  if (newStage === 'Pending') newProgress = 0;
                  if (newStage === 'Technician Assigned') newProgress = 25;
                  if (newStage === 'In Progress') newProgress = 50;
                  if (newStage === 'Resolved') newProgress = 100;

                  setUpdateForm({...updateForm, stage: newStage, progress: newProgress});
                }} 
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-primary-500 outline-none"
              >
                <option>Pending</option>
                <option>Technician Assigned</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Workflow Progress</span>
                <span className="text-primary-700 font-semibold">{updateForm.progress}%</span>
              </label>
              <input 
                type="range"
                min="0"
                max="100"
                step="5"
                value={updateForm.progress} 
                onChange={e => {
                  const newProgress = parseInt(e.target.value);
                  let newStage = updateForm.stage;
                  // Auto-update stage based on progress slider
                  if (newProgress === 100) newStage = 'Resolved';
                  else if (newProgress === 0) newStage = 'Pending';
                  else if (newProgress > 0 && newStage === 'Pending') newStage = 'In Progress';
                  
                  setUpdateForm({...updateForm, progress: newProgress, stage: newStage});
                }} 
                className="w-full accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Maintenance;

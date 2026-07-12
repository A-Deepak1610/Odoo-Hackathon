import React from 'react';
import { Wrench, Plus, ChevronRight } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import StatusPill from '../../../shared/components/StatusPill';
import Button from '../../../shared/components/Button';
import { cn } from '../../../shared/utils/cn';

const mockMaintenance = [
  { id: 'MNT-4021', asset: 'HVAC System Unit B', issue: 'Not cooling properly', reportedBy: 'Facilities', priority: 'High', stage: 'In Progress' },
  { id: 'MNT-4022', asset: 'Delivery Van #4', issue: 'Brake pad replacement', reportedBy: 'Logistics', priority: 'Medium', stage: 'Technician Assigned' },
  { id: 'MNT-4023', asset: 'Projector A1', issue: 'Bulb burned out', reportedBy: 'Marketing', priority: 'Low', stage: 'Pending' },
  { id: 'MNT-4024', asset: 'MacBook Pro 16"', issue: 'Keyboard keys sticky', reportedBy: 'Sarah Jenkins', priority: 'Medium', stage: 'Resolved' },
];

const STAGES = ['Pending', 'Approved', 'Technician Assigned', 'In Progress', 'Resolved'];

const StageStepper = ({ currentStage }) => {
  const currentIndex = STAGES.indexOf(currentStage);
  
  return (
    <div className="flex items-center gap-1 mt-3">
      {STAGES.map((stage, idx) => (
        <React.Fragment key={stage}>
          <div 
            className={cn(
              "h-2 flex-1 rounded-full",
              idx <= currentIndex ? "bg-primary-500" : "bg-gray-200"
            )}
            title={stage}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

const Maintenance = () => {
  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Maintenance Requests" 
        description="Track repair requests, assign technicians, and monitor maintenance workflows."
        actions={<Button icon={Plus}>Raise Request</Button>}
      />

      <div className="grid gap-4">
        {mockMaintenance.map((req) => (
          <div key={req.id} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono font-medium text-gray-500">{req.id}</span>
                  <StatusPill status={req.stage} />
                  {req.priority === 'High' && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">High Priority</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-gray-900">{req.asset}</h3>
                <p className="text-sm text-gray-600 mt-1">{req.issue}</p>
                <p className="text-xs text-gray-400 mt-2">Reported by {req.reportedBy}</p>
              </div>
              
              <div className="sm:w-64 w-full flex flex-col justify-center">
                <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                  <span>Workflow Progress</span>
                  <span className="text-primary-600">{req.stage}</span>
                </div>
                <StageStepper currentStage={req.stage} />
              </div>

              <div className="hidden sm:flex items-center pl-4 border-l border-gray-100">
                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;

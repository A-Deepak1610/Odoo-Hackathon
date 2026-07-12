import React from 'react';
import { ArrowRightLeft, AlertTriangle } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import Button from '../../../shared/components/Button';

const mockAllocations = [
  { id: 'AL-901', asset: 'MacBook Pro 16" (AST-1042)', assignedTo: 'Sarah Jenkins', assignedBy: 'Jane Smith', date: 'Oct 12, 2023', status: 'Allocated' },
  { id: 'AL-902', asset: 'Dell XPS 15 (AST-1043)', assignedTo: 'Mike Ross', assignedBy: 'Jane Smith', date: 'Nov 05, 2023', status: 'Pending Return' },
  { id: 'AL-903', asset: 'Delivery Van #4 (AST-1045)', assignedTo: 'Logistics Team A', assignedBy: 'Admin', date: 'Jan 15, 2024', status: 'Allocated' },
];

const Allocations = () => {
  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Allocation & Transfer" 
        description="Manage asset assignments and handle transfer requests between employees."
        actions={<Button icon={ArrowRightLeft}>New Allocation</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Allocations</h3>
            <DataTable 
              data={mockAllocations}
              columns={[
                { header: 'ID', accessor: 'id', cellClassName: 'text-gray-500 text-xs font-mono' },
                { header: 'Asset', accessor: 'asset', cellClassName: 'font-medium text-gray-900' },
                { header: 'Assigned To', accessor: 'assignedTo' },
                { header: 'Date', accessor: 'date', cellClassName: 'text-gray-500 text-sm' },
                { 
                  header: 'Status', 
                  accessor: 'status',
                  cell: (row) => <StatusPill status={row.status === 'Pending Return' ? 'Pending' : row.status} /> 
                },
              ]}
            />
          </section>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Conflict Resolution</h3>
          
          {/* Conflict State Example */}
          <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-start gap-3">
              <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-amber-900">Allocation Conflict</h4>
                <p className="text-sm text-amber-700 mt-1">An employee is requesting an asset that is currently allocated to someone else.</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Requested Asset</p>
                <p className="text-sm font-medium text-gray-900 mt-1">Projector A1 (AST-1044)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Currently Held By</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">MR</div>
                  <span className="text-sm text-gray-900">Mike Ross (Marketing)</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Requested By</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">SJ</div>
                  <span className="text-sm text-gray-900">Sarah Jenkins (Engineering)</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <Button className="w-full justify-center">Request Transfer</Button>
                <Button variant="ghost" className="w-full justify-center mt-2">Deny Request</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allocations;

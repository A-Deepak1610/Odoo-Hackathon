import React from 'react';
import { ClipboardCheck, Plus, MoreHorizontal } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import Button from '../../../shared/components/Button';
import { cn } from '../../../shared/utils/cn';

const mockAudits = [
  { id: 'AUD-2024-Q1', name: 'Q1 Comprehensive Asset Audit', scope: 'All Departments', auditors: 'Jane Smith, Tech Team', status: 'Completed', discrepancies: 2 },
  { id: 'AUD-2024-Q2', name: 'Q2 IT Infrastructure Audit', scope: 'IT Department', auditors: 'External Auditor', status: 'In Progress', discrepancies: 0 },
  { id: 'AUD-2024-Q3', name: 'Q3 Vehicle Fleet Check', scope: 'Logistics', auditors: 'Sarah Jenkins', status: 'Pending', discrepancies: 0 },
];

const Audit = () => {
  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Asset Audits" 
        description="Manage audit cycles, track discrepancies, and ensure compliance."
        actions={<Button icon={Plus}>New Audit Cycle</Button>}
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <DataTable 
          data={mockAudits}
          columns={[
            { header: 'Audit ID', accessor: 'id', cellClassName: 'text-gray-500 font-mono text-xs' },
            { header: 'Audit Name', accessor: 'name', cellClassName: 'font-medium text-gray-900' },
            { header: 'Scope', accessor: 'scope', cellClassName: 'text-gray-600' },
            { header: 'Assigned Auditors', accessor: 'auditors', cellClassName: 'text-gray-600' },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (row) => <StatusPill status={row.status} /> 
            },
            {
              header: 'Discrepancies',
              cell: (row) => (
                <div className={cn(
                  "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                  row.discrepancies > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                )}>
                  {row.discrepancies}
                </div>
              ),
              className: 'text-center',
              cellClassName: 'text-center'
            },
            {
              header: 'Actions',
              cell: () => <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18}/></button>,
              className: 'text-right',
              cellClassName: 'text-right'
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Audit;

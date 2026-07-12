import React, { useState } from 'react';
import { ClipboardCheck, Plus, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '../../../../shared/components/PageHeader';
import DataTable from '../../../../shared/components/DataTable';
import StatusPill from '../../../../shared/components/StatusPill';
import StatCard from '../../../../shared/components/StatCard';
import Button from '../../../../shared/components/Button';
import Modal from '../../../../shared/components/Modal';
import { cn } from '../../../../shared/utils/cn';

// --- MOCK DATA ---
const initialAudits = [
  { id: 'AUD-2024-Q1', name: 'Q1 Comprehensive Asset Audit', scope: 'All Departments', auditors: 'Jane Smith, Tech Team', status: 'Completed', discrepancies: 2 },
  { id: 'AUD-2024-Q2', name: 'Q2 IT Infrastructure Audit', scope: 'IT Department', auditors: 'External Auditor', status: 'In Progress', discrepancies: 0 },
  { id: 'AUD-2024-Q3', name: 'Q3 Vehicle Fleet Check', scope: 'Logistics', auditors: 'Sarah Jenkins', status: 'Pending', discrepancies: 0 },
];

const mockAuditAssets = [
  { id: 'AST-1001', name: 'MacBook Pro 16"', location: 'Engineering - Floor 2', status: 'Pending' },
  { id: 'AST-1002', name: 'Dell XPS 15', location: 'IT Department', status: 'Verified' },
  { id: 'AST-1003', name: 'Office Chair (Ergo)', location: 'Marketing - Room B', status: 'Missing' },
  { id: 'AST-1004', name: 'Server Rack A1', location: 'Server Room', status: 'Pending' },
  { id: 'AST-1005', name: 'Delivery Van #4', location: 'Garage', status: 'Damaged' },
];

const Audit = () => {
  const [audits, setAudits] = useState(initialAudits);
  const [selectedAudit, setSelectedAudit] = useState(null);
  
  // Detail view state for assets in the specific audit
  const [auditAssets, setAuditAssets] = useState(mockAuditAssets);

  // New Audit Modal state
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const [newAuditName, setNewAuditName] = useState('');
  const [newAuditScope, setNewAuditScope] = useState('');

  // Auto-calculated stats for the master view
  const totalAudits = audits.length;
  const inProgress = audits.filter(a => a.status === 'In Progress').length;
  const passRate = "94%";
  const totalDiscrepancies = audits.reduce((sum, a) => sum + a.discrepancies, 0);

  // --- ACTIONS ---
  const handleVerifyAsset = (assetId, newStatus) => {
    setAuditAssets(prev => prev.map(asset => asset.id === assetId ? { ...asset, status: newStatus } : asset));
  };

  const handleCompleteAudit = () => {
    const discrepanciesFound = auditAssets.filter(a => a.status === 'Missing' || a.status === 'Damaged').length;
    
    setAudits(prev => prev.map(audit => 
      audit.id === selectedAudit.id 
        ? { ...audit, status: 'Completed', discrepancies: discrepanciesFound }
        : audit
    ));
    
    setSelectedAudit(null);
  };

  const handleCreateAudit = (e) => {
    e.preventDefault();
    if (!newAuditName || !newAuditScope) return;
    
    const newAudit = {
      id: `AUD-2024-Q${Math.floor(Math.random() * 4) + 1}-${Math.floor(Math.random() * 1000)}`,
      name: newAuditName,
      scope: newAuditScope,
      auditors: 'You (Current User)',
      status: 'Pending',
      discrepancies: 0
    };
    
    setAudits([newAudit, ...audits]);
    setIsNewAuditModalOpen(false);
    setNewAuditName('');
    setNewAuditScope('');
  };

  // --- RENDERERS ---
  const renderMasterView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Audits" value={totalAudits} subtitle="Lifetime" color="indigo" icon={ClipboardCheck} />
        <StatCard title="In Progress" value={inProgress} subtitle="Active cycle" color="amber" icon={ClipboardCheck} />
        <StatCard title="Compliance" value={passRate} subtitle="Pass rate" color="emerald" icon={CheckCircle} />
        <StatCard title="Discrepancies" value={totalDiscrepancies} subtitle="Action required" color="red" icon={AlertTriangle} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Audit Cycles</h3>
        </div>
        <DataTable 
          data={audits}
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
              cell: (row) => (
                <Button 
                  size="sm" 
                  variant={row.status === 'Completed' ? 'secondary' : 'primary'}
                  onClick={() => {
                    setSelectedAudit(row);
                    // Reset mock assets to pending when opening an active one for demo purposes
                    if (row.status !== 'Completed') {
                      setAuditAssets(mockAuditAssets.map(a => ({ ...a, status: 'Pending' })));
                    } else {
                      setAuditAssets(mockAuditAssets); // Show random state if completed
                    }
                  }}
                >
                  {row.status === 'Completed' ? 'View' : 'Execute'}
                </Button>
              ),
              className: 'text-right',
              cellClassName: 'text-right'
            }
          ]}
        />
      </div>
    </div>
  );

  const renderDetailView = () => {
    const isCompleted = selectedAudit.status === 'Completed';
    const pendingCount = auditAssets.filter(a => a.status === 'Pending').length;
    const missingOrDamaged = auditAssets.filter(a => a.status === 'Missing' || a.status === 'Damaged').length;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedAudit(null)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Audit Cycles
        </button>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedAudit.name}</h2>
                <StatusPill status={selectedAudit.status} />
              </div>
              <p className="text-sm text-gray-500">ID: <span className="font-mono text-gray-700">{selectedAudit.id}</span> • Scope: {selectedAudit.scope}</p>
            </div>
            {!isCompleted && (
              <Button 
                onClick={handleCompleteAudit} 
                disabled={pendingCount > 0}
                className="gap-2"
              >
                <ClipboardCheck size={16} />
                Complete Audit Cycle
              </Button>
            )}
          </div>

          <div className="mb-4 flex gap-4">
            <div className="px-4 py-3 bg-gray-50 rounded-lg flex-1 border border-gray-100">
              <div className="text-xs text-gray-500 font-medium mb-1">Assets Pending</div>
              <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
            </div>
            <div className={cn("px-4 py-3 rounded-lg flex-1 border", missingOrDamaged > 0 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100")}>
              <div className={cn("text-xs font-medium mb-1", missingOrDamaged > 0 ? "text-red-600" : "text-gray-500")}>Discrepancies Found</div>
              <div className={cn("text-2xl font-bold", missingOrDamaged > 0 ? "text-red-700" : "text-gray-900")}>{missingOrDamaged}</div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-900 mb-3">Asset Verification List</h3>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <DataTable 
              data={auditAssets}
              columns={[
                { header: 'Asset Tag', accessor: 'id', cellClassName: 'font-mono text-xs text-gray-500' },
                { header: 'Asset Name', accessor: 'name', cellClassName: 'font-medium text-gray-900' },
                { header: 'Expected Location', accessor: 'location', cellClassName: 'text-gray-600' },
                { 
                  header: 'Verification Status', 
                  cell: (row) => {
                    if (isCompleted) {
                      // Read-only state
                      return (
                        <div className="inline-flex items-center gap-1.5 font-medium text-xs">
                          {row.status === 'Verified' && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={14}/> Verified</span>}
                          {row.status === 'Missing' && <span className="text-red-600 flex items-center gap-1"><XCircle size={14}/> Missing</span>}
                          {row.status === 'Damaged' && <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={14}/> Damaged</span>}
                          {row.status === 'Pending' && <span className="text-gray-500 flex items-center gap-1">Pending</span>}
                        </div>
                      );
                    }

                    // Interactive state
                    return (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleVerifyAsset(row.id, 'Verified')}
                          className={cn("px-2.5 py-1 rounded text-xs font-medium border transition-colors", 
                            row.status === 'Verified' ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                          )}
                        >
                          Verified
                        </button>
                        <button 
                          onClick={() => handleVerifyAsset(row.id, 'Missing')}
                          className={cn("px-2.5 py-1 rounded text-xs font-medium border transition-colors", 
                            row.status === 'Missing' ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                          )}
                        >
                          Missing
                        </button>
                        <button 
                          onClick={() => handleVerifyAsset(row.id, 'Damaged')}
                          className={cn("px-2.5 py-1 rounded text-xs font-medium border transition-colors", 
                            row.status === 'Damaged' ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                          )}
                        >
                          Damaged
                        </button>
                      </div>
                    );
                  }
                },
              ]}
            />
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Asset Audits" 
        description={selectedAudit ? `Executing verification for ${selectedAudit.id}` : "Manage audit cycles, track discrepancies, and ensure compliance."}
        actions={!selectedAudit && <Button icon={Plus} onClick={() => setIsNewAuditModalOpen(true)}>New Audit Cycle</Button>}
      />

      {selectedAudit ? renderDetailView() : renderMasterView()}

      <Modal isOpen={isNewAuditModalOpen} onClose={() => setIsNewAuditModalOpen(false)} title="Start New Audit Cycle">
        <form onSubmit={handleCreateAudit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audit Name</label>
            <input 
              type="text" 
              required
              value={newAuditName}
              onChange={(e) => setNewAuditName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Q4 Department Audit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
            <input 
              type="text" 
              required
              value={newAuditScope}
              onChange={(e) => setNewAuditScope(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Engineering Assets"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsNewAuditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Audit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Audit;

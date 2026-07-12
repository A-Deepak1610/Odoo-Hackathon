import React, { useState } from 'react';
import { 
  ClipboardCheck, ScanBarcode, CheckCircle2, XCircle, 
  AlertTriangle, History, X, Search, FileText, Check
} from 'lucide-react';
import { DashboardCard, ActivityCard } from '../components/dashboard';
import { Button, Badge, Input, Label, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui';

// Status Badge Component for Audit
const AuditStatusBadge = ({ status }) => {
  const config = {
    'Verified': 'success',
    'Missing': 'danger',
    'Damaged': 'warning',
    'Pending': 'neutral',
  };
  
  return (
    <Badge variant={config[status] || 'neutral'}>
      {status}
    </Badge>
  );
};

// Placeholder Data
const MOCK_AUDIT_ASSETS = [
  { id: '1', tag: 'AST-2024-001', name: 'MacBook Pro 16"', location: 'Engineering Dept', expectedHolder: 'Sarah Jenkins', status: 'Verified' },
  { id: '2', tag: 'AST-2024-005', name: 'Conference Projector A', location: 'Meeting Room 1', expectedHolder: 'Facilities', status: 'Damaged' },
  { id: '3', tag: 'AST-2024-042', name: 'Dell XPS 15', location: 'IT Storage', expectedHolder: 'IT Dept', status: 'Missing' },
  { id: '4', tag: 'AST-2024-018', name: 'Herman Miller Chair', location: 'Marketing Dept', expectedHolder: 'John Doe', status: 'Pending' },
  { id: '5', tag: 'AST-2024-019', name: 'Sony A7IV Camera Kit', location: 'Marketing Dept', expectedHolder: 'Alex Chen', status: 'Pending' },
];

const AuditPage = () => {
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const stats = {
    total: 145,
    scanned: 124,
    verified: 120,
    missing: 2,
    damaged: 2
  };

  const progressPercentage = Math.round((stats.scanned / stats.total) * 100);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Audit & Reconciliation</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Conduct physical verifications and track inventory discrepancies.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none gap-2">
            <History size={16} /> Audit History
          </Button>
          <Button className="flex-1 sm:flex-none gap-2" onClick={() => setIsStartModalOpen(true)}>
            <ClipboardCheck size={16} /> Start New Cycle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Column - Active Audit Data */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Audit Dashboard Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Total Assets</span>
              <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">Scanned</span>
              <span className="text-3xl font-bold text-blue-700">{stats.scanned}</span>
            </div>
            <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1.5">Verified</span>
              <span className="text-3xl font-bold text-emerald-700">{stats.verified}</span>
            </div>
            <div className="bg-red-50/50 p-5 rounded-xl border border-red-200 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1.5">Missing</span>
              <span className="text-3xl font-bold text-red-700">{stats.missing}</span>
            </div>
            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">Damaged</span>
              <span className="text-3xl font-bold text-amber-700">{stats.damaged}</span>
            </div>
          </div>

          {/* Verification Table */}
          <DashboardCard 
            title="Q4 2024 Comprehensive Audit - Verification List"
            action={
              <div className="flex gap-2">
                <div className="relative w-48 hidden sm:block">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input type="text" placeholder="Search by tag..." className="pl-9 h-8 text-xs w-full" />
                </div>
                <Button variant="secondary" size="sm" className="gap-1.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  <ScanBarcode size={14} /> Scanner Mode
                </Button>
              </div>
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Details</TableHead>
                  <TableHead>Expected Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Verification Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_AUDIT_ASSETS.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <p className="font-bold text-slate-900">{asset.name}</p>
                      <p className="text-xs font-medium font-mono text-slate-500">{asset.tag}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-slate-900">{asset.location}</p>
                      <p className="text-xs font-medium text-slate-500">{asset.expectedHolder}</p>
                    </TableCell>
                    <TableCell>
                      <AuditStatusBadge status={asset.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {asset.status === 'Pending' ? (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 border border-emerald-200 bg-emerald-50/50" title="Mark Verified">
                              <CheckCircle2 size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700 border border-amber-200 bg-amber-50/50" title="Mark Damaged">
                              <AlertTriangle size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 bg-red-50/50" title="Mark Missing">
                              <XCircle size={16} />
                            </Button>
                          </>
                        ) : (
                          <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold">
                            Reset
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
              <Button variant="ghost" className="text-blue-600 text-xs h-8">View All {stats.total} Assets</Button>
            </div>
          </DashboardCard>
        </div>

        {/* Right Sidebar - Status & Summary */}
        <div className="space-y-6">
          
          {/* Active Cycle Progress */}
          <DashboardCard title="Audit Progress">
            <div className="mb-5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-900">Q4 2024 Audit</span>
                <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 mb-1.5 overflow-hidden border border-slate-200">
                <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="text-xs font-semibold text-slate-500 text-right">{stats.scanned} of {stats.total} scanned</p>
            </div>
            
            <div className="space-y-3 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                <div className="flex-1 text-sm text-slate-700 font-semibold">Verified</div>
                <div className="text-sm font-bold text-slate-900">{stats.verified}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                <div className="flex-1 text-sm text-slate-700 font-semibold">Discrepancies</div>
                <div className="text-sm font-bold text-slate-900">{stats.missing + stats.damaged}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-sm"></div>
                <div className="flex-1 text-sm text-slate-700 font-semibold">Pending</div>
                <div className="text-sm font-bold text-slate-900">{stats.total - stats.scanned}</div>
              </div>
            </div>

            <Button 
              onClick={() => setIsCloseModalOpen(true)}
              className="w-full mt-6 bg-slate-900 hover:bg-slate-800"
            >
              Close Audit Cycle
            </Button>
          </DashboardCard>

          {/* Discrepancy Summary */}
          <DashboardCard title="Discrepancy Summary">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-4 flex items-start gap-3 shadow-sm">
              <XCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">2 Missing Assets</p>
                <p className="text-xs font-medium text-red-700 mt-1">Dell XPS 15 (AST-2024-042) and 1 other are unaccounted for.</p>
              </div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 shadow-sm">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">2 Damaged Assets</p>
                <p className="text-xs font-medium text-amber-700 mt-1">Projector A requires repair. Maintenance ticket generated automatically.</p>
              </div>
            </div>
          </DashboardCard>

          {/* History Timeline */}
          <DashboardCard title="Audit History">
            <div className="pt-2 pl-2">
              <ActivityCard 
                title="Q3 2024 Audit Closed"
                description="Finalized by Admin. 100% verification rate achieved."
                timestamp="Jul 30, 2024"
                icon={CheckCircle2}
                iconColor="emerald"
              />
              <ActivityCard 
                title="Discrepancy Resolved"
                description="Missing iPad found in IT Storage."
                timestamp="Jul 28, 2024"
                icon={Check}
                iconColor="blue"
              />
              <ActivityCard 
                title="Q3 2024 Audit Started"
                description="Cycle initiated."
                timestamp="Jul 01, 2024"
                icon={ClipboardCheck}
                iconColor="slate"
              />
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Close Audit Dialog */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">Close Audit Cycle</h3>
              <button onClick={() => setIsCloseModalOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1 rounded-md transition-colors"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
                <AlertTriangle size={24} className="text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900">Warning: Unresolved Discrepancies</h4>
                  <p className="text-sm font-medium text-amber-800 mt-1.5 leading-relaxed">
                    You are closing the audit with <span className="font-bold">4 discrepancies</span> (2 missing, 2 damaged). 
                    Closing the audit will lock the verification list and generate a final report.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Final Remarks</Label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                  <textarea 
                    rows="3" 
                    placeholder="Enter closing remarks or actions taken regarding discrepancies..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                <span className="text-sm font-bold text-slate-800">Acknowledge discrepancies and generate final report.</span>
              </label>

            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsCloseModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCloseModalOpen(false)} className="bg-slate-900 hover:bg-slate-800 text-white">
                Confirm Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Start Audit Dialog */}
      {isStartModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg">Start New Audit Cycle</h3>
              <button onClick={() => setIsStartModalOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1 rounded-md transition-colors"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Audit Name / Reference</Label>
                <Input type="text" placeholder="e.g., Q1 2025 Comprehensive Audit" />
              </div>
              <div className="space-y-2">
                <Label>Target Scope</Label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>All Assets</option>
                  <option>IT Equipment Only</option>
                  <option>Facilities & Furniture</option>
                  <option>Specific Department</option>
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Starting a new cycle will archive the current active audit and generate a new verification list based on your selected scope.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsStartModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsStartModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <ClipboardCheck size={16} /> Start Audit
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AuditPage;

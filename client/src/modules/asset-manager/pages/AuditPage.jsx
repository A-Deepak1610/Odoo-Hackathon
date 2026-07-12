import React, { useState } from 'react';
import { 
  ClipboardCheck, ScanBarcode, CheckCircle2, XCircle, 
  AlertTriangle, History, X, Search, FileText, Check
} from 'lucide-react';
import { DashboardCard, ActivityCard } from '../components';

// Status Badge Component for Audit
const AuditStatusBadge = ({ status }) => {
  const config = {
    'Verified': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Missing': 'bg-red-100 text-red-700 border-red-200',
    'Damaged': 'bg-amber-100 text-amber-700 border-amber-200',
    'Pending': 'bg-slate-100 text-slate-600 border-slate-200',
  };
  
  return (
    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${config[status]}`}>
      {status}
    </span>
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
  const [activeTab, setActiveTab] = useState('active');

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
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Asset Audit & Reconciliation</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Conduct physical verifications and track inventory discrepancies.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm focus:outline-none">
            <History size={16} /> Audit History
          </button>
          <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
            <ClipboardCheck size={16} /> Start New Cycle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Column - Active Audit Data */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Audit Dashboard Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Assets</span>
              <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-center items-center text-center bg-blue-50/30">
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Scanned</span>
              <span className="text-2xl font-bold text-blue-700">{stats.scanned}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-center items-center text-center bg-emerald-50/30">
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Verified</span>
              <span className="text-2xl font-bold text-emerald-700">{stats.verified}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col justify-center items-center text-center bg-red-50/30">
              <span className="text-sm font-bold text-red-600 uppercase tracking-wider mb-1">Missing</span>
              <span className="text-2xl font-bold text-red-700">{stats.missing}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-center items-center text-center bg-amber-50/30">
              <span className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">Damaged</span>
              <span className="text-2xl font-bold text-amber-700">{stats.damaged}</span>
            </div>
          </div>

          {/* Verification Table */}
          <DashboardCard 
            title="Q4 2024 Comprehensive Audit - Verification List"
            action={
              <div className="flex gap-2">
                <div className="relative w-48 hidden sm:block">
                  <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search by tag..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm font-semibold hover:bg-blue-100 transition-colors">
                  <ScanBarcode size={14} /> Scanner Mode
                </button>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                    <th className="pb-3 pl-2">Asset Details</th>
                    <th className="pb-3">Expected Location</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {MOCK_AUDIT_ASSETS.map((asset) => (
                    <tr key={asset.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pl-2">
                        <p className="font-bold text-slate-800">{asset.name}</p>
                        <p className="text-xs font-mono text-slate-500">{asset.tag}</p>
                      </td>
                      <td className="py-3.5">
                        <p className="font-medium text-slate-800">{asset.location}</p>
                        <p className="text-xs text-slate-500">{asset.expectedHolder}</p>
                      </td>
                      <td className="py-3.5">
                        <AuditStatusBadge status={asset.status} />
                      </td>
                      <td className="py-3.5 pr-2">
                        <div className="flex justify-end gap-1.5">
                          {asset.status === 'Pending' ? (
                            <>
                              <button className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors" title="Mark Verified">
                                <CheckCircle2 size={16} />
                              </button>
                              <button className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors" title="Mark Damaged">
                                <AlertTriangle size={16} />
                              </button>
                              <button className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors" title="Mark Missing">
                                <XCircle size={16} />
                              </button>
                            </>
                          ) : (
                            <button className="px-3 py-1 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold transition-colors">
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">View All {stats.total} Assets</button>
            </div>
          </DashboardCard>
        </div>

        {/* Right Sidebar - Status & Summary */}
        <div className="space-y-6">
          
          {/* Active Cycle Progress */}
          <DashboardCard title="Audit Progress">
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-800">Q4 2024 Audit</span>
                <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 mb-1 overflow-hidden border border-slate-200">
                <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="text-xs font-medium text-slate-500 text-right">{stats.scanned} of {stats.total} scanned</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div className="flex-1 text-sm text-slate-600 font-medium">Verified</div>
                <div className="text-sm font-bold text-slate-800">{stats.verified}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="flex-1 text-sm text-slate-600 font-medium">Discrepancies</div>
                <div className="text-sm font-bold text-slate-800">{stats.missing + stats.damaged}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <div className="flex-1 text-sm text-slate-600 font-medium">Pending</div>
                <div className="text-sm font-bold text-slate-800">{stats.total - stats.scanned}</div>
              </div>
            </div>

            <button 
              onClick={() => setIsCloseModalOpen(true)}
              className="w-full mt-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 shadow-sm"
            >
              Close Audit Cycle
            </button>
          </DashboardCard>

          {/* Discrepancy Summary */}
          <DashboardCard title="Discrepancy Summary">
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg mb-3 flex items-start gap-3">
              <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">2 Missing Assets</p>
                <p className="text-xs text-red-700 mt-1">Dell XPS 15 (AST-2024-042) and 1 other are unaccounted for.</p>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">2 Damaged Assets</p>
                <p className="text-xs text-amber-700 mt-1">Projector A requires repair. Maintenance ticket generated automatically.</p>
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
              <h3 className="font-bold text-slate-800 text-lg">Close Audit Cycle</h3>
              <button onClick={() => setIsCloseModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={24} className="text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900">Warning: Unresolved Discrepancies</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    You are closing the audit with <span className="font-bold">4 discrepancies</span> (2 missing, 2 damaged). 
                    Closing the audit will lock the verification list and generate a final report.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Final Remarks</label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                  <textarea 
                    rows="3" 
                    placeholder="Enter closing remarks or actions taken regarding discrepancies..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">Acknowledge discrepancies and generate final report.</span>
              </label>

            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsCloseModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300 bg-white">
                Cancel
              </button>
              <button onClick={() => setIsCloseModalOpen(false)} className="px-6 py-2 text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors shadow-sm">
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AuditPage;

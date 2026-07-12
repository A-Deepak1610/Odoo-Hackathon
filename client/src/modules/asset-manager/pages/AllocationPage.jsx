import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Building2, Calendar, AlertTriangle, ArrowRightLeft, 
  CheckCircle2, Clock, RotateCcw, Box, FileText, Search, X
} from 'lucide-react';
import { DashboardCard, ActivityCard, AlertCard } from '../components/dashboard';
import { Input, Select, Button, Label, Card, CardContent } from '../components/ui';

const AllocationPage = () => {
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Allocation & Transfer</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Assign assets to employees, manage departmental transfers, and process returns.</p>
      </div>

      {/* Top Conflict Alert - Only visible if there is a conflict */}
      <AlertCard 
        title="Allocation Conflict Detected"
        message="The asset 'Conference Projector A' is already booked by Marketing on the selected dates. Proceeding will require overriding the existing booking."
        actionText="Resolve Conflict"
        onAction={() => console.log('Resolve conflict')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column - Action Forms */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Allocate Asset Form */}
          <DashboardCard title="Allocate New Asset">
            <form className="space-y-6">
              
              {/* Asset Selection */}
              <div className="space-y-2">
                <Label>Select Asset *</Label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input 
                    type="text" 
                    placeholder="Search by asset tag or name..." 
                    className="pl-9"
                    defaultValue="AST-2024-042 - Dell XPS 15"
                  />
                </div>
                
                {/* Current Holder Preview (if transferring) */}
                <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white border border-blue-200 rounded-lg shadow-sm text-blue-600"><Box size={18} /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Current Status</p>
                      <p className="text-sm font-semibold text-slate-800">Allocated to <span className="font-bold text-blue-700">IT Department Storage</span></p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded-md border border-blue-200">Transfer Required</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Employee Selector */}
                <div className="space-y-2">
                  <Label>Assign To Employee</Label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Select className="pl-9">
                      <option value="">Select Employee...</option>
                      <option value="1" selected>Alex Chen (Engineering)</option>
                      <option value="2">Sarah Jenkins (Marketing)</option>
                      <option value="3">Mike Ross (Logistics)</option>
                    </Select>
                  </div>
                </div>

                {/* Department Selector */}
                <div className="space-y-2">
                  <Label>Or Assign To Department</Label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Select className="pl-9">
                      <option value="">Select Department...</option>
                      <option value="eng">Engineering</option>
                      <option value="mkt">Marketing</option>
                      <option value="hr">HR</option>
                    </Select>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <Label>Allocation Date *</Label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input 
                      type="date" 
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Expected Return Date</Label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input 
                      type="date" 
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1">Leave blank for permanent assignment</p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={() => {}}>
                  Cancel
                </Button>
                <Button variant="primary" type="button" className="gap-2" onClick={() => setShowTransferSuccess(true)}>
                  <ArrowRightLeft size={16} />
                  Initiate Transfer
                </Button>
              </div>
            </form>
          </DashboardCard>

          {/* Return Asset Form */}
          <DashboardCard title="Process Return">
            <form className="space-y-6">
              
              <div className="space-y-2">
                <Label>Asset to Return</Label>
                <div className="relative">
                  <RotateCcw size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input 
                    type="text" 
                    placeholder="Scan QR or enter asset tag..." 
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Return Condition *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="cursor-pointer">
                      <input type="radio" name="condition" className="peer sr-only" defaultChecked />
                      <div className="text-center px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 hover:bg-slate-50 transition-colors">
                        Good
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="condition" className="peer sr-only" />
                      <div className="text-center px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700 hover:bg-slate-50 transition-colors">
                        Damaged
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="condition" className="peer sr-only" />
                      <div className="text-center px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 hover:bg-slate-50 transition-colors">
                        Lost
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Return Location *</Label>
                  <Select>
                    <option value="">Select drop-off location...</option>
                    <option value="1">IT Storage Room A</option>
                    <option value="2">Facilities Desk</option>
                  </Select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label>Return Notes</Label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                    <textarea 
                      rows="3"
                      placeholder="Note any damages, missing accessories, or reason for return..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex justify-end">
                <Button type="button" className="bg-slate-800 hover:bg-slate-900 text-white gap-2" onClick={() => setShowReturnSuccess(true)}>
                  <CheckCircle2 size={16} />
                  Confirm Return
                </Button>
              </div>

            </form>
          </DashboardCard>

        </div>

        {/* Right Column - Status & History */}
        <div className="space-y-6">
          
          {/* Transfer Approval Timeline */}
          <DashboardCard title="Transfer Request Status">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl mb-4 shadow-sm">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Active Request</p>
                <p className="text-sm font-bold text-slate-900">AST-2024-089 (Herman Miller Chair)</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Requested by: John Doe (Engineering)</p>
              </div>

              <div className="relative pl-4 space-y-6 py-2">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-white shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Request Submitted</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Today, 09:41 AM</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-white shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Department Head Approved</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Today, 11:30 AM</p>
                  </div>
                </div>

                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-4 h-4 bg-amber-400 rounded-full ring-4 ring-white shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Pending Asset Manager</p>
                    <p className="text-xs text-amber-600 font-semibold mt-1 cursor-pointer hover:underline">Click to review & approve</p>
                  </div>
                </div>

                <div className="relative z-10 flex items-start gap-4 opacity-50">
                  <div className="w-4 h-4 bg-slate-300 rounded-full ring-4 ring-white shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Ready for Pickup</p>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Transfer History */}
          <DashboardCard title="Recent Activity">
            <div className="pt-2 pl-2">
              <ActivityCard 
                title="Return Processed"
                description="Dell XPS 15 returned by Jane Smith."
                timestamp="2 hrs ago"
                icon={RotateCcw}
                iconColor="slate"
              />
              <ActivityCard 
                title="Asset Allocated"
                description="iPad Pro assigned to Marketing Dept."
                timestamp="Yesterday"
                icon={CheckCircle2}
                iconColor="emerald"
              />
              <ActivityCard 
                title="Transfer Denied"
                description="Request for Server Rack B rejected."
                timestamp="Yesterday"
                icon={AlertTriangle}
                iconColor="amber"
              />
            </div>
          </DashboardCard>

        </div>
      </div>

      {/* Transfer Success Modal */}
      {showTransferSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-bold text-slate-900 text-xl">Transfer Initiated</h3>
              <p className="text-sm text-slate-500">
                The transfer request for <span className="font-semibold text-slate-700">Dell XPS 15</span> has been successfully submitted for approval.
              </p>
              <Button className="w-full mt-4" onClick={() => setShowTransferSuccess(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Return Success Modal */}
      {showReturnSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <RotateCcw size={32} />
              </div>
              <h3 className="font-bold text-slate-900 text-xl">Return Processed</h3>
              <p className="text-sm text-slate-500">
                The asset has been successfully marked as returned and is now available in inventory.
              </p>
              <Button className="w-full mt-4" onClick={() => setShowReturnSuccess(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationPage;

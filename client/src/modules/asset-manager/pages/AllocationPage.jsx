import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  User, Building2, Calendar, AlertTriangle, ArrowRightLeft, 
  CheckCircle2, Clock, RotateCcw, Box, FileText, Search, X
} from 'lucide-react';
import { DashboardCard, ActivityCard, AlertCard } from '../components/dashboard';
import { Input, Select, Button, Label, Card, CardContent } from '../components/ui';
import { 
  getAllocationsApi, getEmployeesApi, getDepartmentsApi, getAssetsApi, 
  allocateAssetApi, returnAssetApi, approveTransferApi, rejectTransferApi
} from '../api';

const AllocationPage = () => {
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assets, setAssets] = useState([]);
  
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);

  // Form states
  const [selectedAssetForAllocation, setSelectedAssetForAllocation] = useState(null);
  const [selectedAssetForReturn, setSelectedAssetForReturn] = useState(null);
  const [isAllocating, setIsAllocating] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  
  const [conflictMsg, setConflictMsg] = useState('');

  const { register: registerAlloc, handleSubmit: handleAllocSubmit, watch: watchAlloc, reset: resetAlloc } = useForm();
  const { register: registerReturn, handleSubmit: handleReturnSubmit, reset: resetReturn } = useForm();

  const loadData = async () => {
    try {
      const [allocRes, empRes, depRes, assetRes] = await Promise.all([
        getAllocationsApi(),
        getEmployeesApi(),
        getDepartmentsApi(),
        getAssetsApi()
      ]);
      if (allocRes.success) setAllocations(allocRes.data);
      if (empRes.success) setEmployees(empRes.data);
      if (depRes.success) setDepartments(depRes.data);
      if (assetRes.success) setAssets(assetRes.data);
    } catch (error) {
      console.error('Failed to load allocation page data', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onAllocate = async (data) => {
    if (!selectedAssetForAllocation) return;
    setConflictMsg('');
    setIsAllocating(true);
    try {
      const payload = {
        assetId: selectedAssetForAllocation.id,
        toEmployeeId: data.employeeId || null,
        toDepartmentId: data.departmentId || null,
        expectedReturnDate: data.expectedReturnDate || null
      };
      const res = await allocateAssetApi(payload);
      if (res.success) {
        setShowTransferSuccess(true);
        resetAlloc();
        setSelectedAssetForAllocation(null);
        loadData();
      } else {
        setConflictMsg(res.message);
      }
    } catch (err) {
      setConflictMsg('Failed to allocate asset');
    } finally {
      setIsAllocating(false);
    }
  };

  const onReturn = async (data) => {
    if (!selectedAssetForReturn) return;
    setIsReturning(true);
    try {
      // Find active allocation for this asset
      const activeAlloc = allocations.find(a => a.assetId === selectedAssetForReturn.id && a.status === 'ACTIVE');
      if (!activeAlloc) {
        alert("No active allocation found for this asset.");
        setIsReturning(false);
        return;
      }

      const res = await returnAssetApi(activeAlloc.id, {
        condition: data.condition,
        checkInNotes: data.checkInNotes
      });
      if (res.success) {
        setShowReturnSuccess(true);
        resetReturn();
        setSelectedAssetForReturn(null);
        loadData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Failed to return asset");
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Allocation & Transfer</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Assign assets to employees, manage departmental transfers, and process returns.</p>
      </div>

      {/* Top Conflict Alert */}
      {conflictMsg && (
        <AlertCard 
          title="Allocation Issue Detected"
          message={conflictMsg}
          actionText="Dismiss"
          onAction={() => setConflictMsg('')}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column - Action Forms */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Allocate Asset Form */}
          <DashboardCard title="Allocate New Asset">
            <form className="space-y-6" onSubmit={handleAllocSubmit(onAllocate)}>
              
              {/* Asset Selection */}
              <div className="space-y-2">
                <Label>Select Asset *</Label>
                <div className="relative">
                  <Box size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Select 
                    className="pl-9" 
                    onChange={(e) => {
                      const ast = assets.find(a => a.id === e.target.value);
                      setSelectedAssetForAllocation(ast || null);
                    }}
                    value={selectedAssetForAllocation?.id || ''}
                  >
                    <option value="">Select Available Asset...</option>
                    {assets.filter(a => a.status === 'AVAILABLE' || a.status === 'ALLOCATED').map(a => (
                      <option key={a.id} value={a.id}>{a.assetTag} - {a.name}</option>
                    ))}
                  </Select>
                </div>
                
                {/* Current Holder Preview (if transferring) */}
                {selectedAssetForAllocation && selectedAssetForAllocation.status === 'ALLOCATED' && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white border border-blue-200 rounded-lg shadow-sm text-blue-600"><Box size={18} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Current Status</p>
                        <p className="text-sm font-semibold text-slate-800">Allocated to <span className="font-bold text-blue-700">{selectedAssetForAllocation.currentEmployee?.name || selectedAssetForAllocation.currentDepartment?.name || 'Unknown'}</span></p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded-md border border-blue-200">Transfer Required</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Employee Selector */}
                <div className="space-y-2">
                  <Label>Assign To Employee</Label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Select className="pl-9" {...registerAlloc('employeeId')}>
                      <option value="">Select Employee...</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.department?.name || 'No Dept'})</option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Department Selector */}
                <div className="space-y-2">
                  <Label>Or Assign To Department</Label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Select className="pl-9" {...registerAlloc('departmentId')}>
                      <option value="">Select Department...</option>
                      {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <Label>Expected Return Date</Label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input 
                      type="date" 
                      className="pl-9"
                      {...registerAlloc('expectedReturnDate')}
                    />
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-1">Leave blank for permanent assignment</p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={() => {
                  resetAlloc();
                  setSelectedAssetForAllocation(null);
                }} disabled={isAllocating}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="gap-2" disabled={isAllocating || !selectedAssetForAllocation}>
                  <ArrowRightLeft size={16} />
                  {isAllocating ? 'Allocating...' : 'Allocate Asset'}
                </Button>
              </div>
            </form>
          </DashboardCard>

          {/* Return Asset Form */}
          <DashboardCard title="Process Return">
            <form className="space-y-6" onSubmit={handleReturnSubmit(onReturn)}>
              
              <div className="space-y-2">
                <Label>Asset to Return</Label>
                <div className="relative">
                  <RotateCcw size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Select 
                    className="pl-9"
                    onChange={(e) => {
                      const ast = assets.find(a => a.id === e.target.value);
                      setSelectedAssetForReturn(ast || null);
                    }}
                    value={selectedAssetForReturn?.id || ''}
                  >
                    <option value="">Select Allocated Asset...</option>
                    {assets.filter(a => a.status === 'ALLOCATED').map(a => (
                      <option key={a.id} value={a.id}>{a.assetTag} - {a.name}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Return Condition *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="cursor-pointer">
                      <input type="radio" value="Good" {...registerReturn('condition')} className="peer sr-only" defaultChecked />
                      <div className="text-center px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 hover:bg-slate-50 transition-colors">
                        Good
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" value="Fair" {...registerReturn('condition')} className="peer sr-only" />
                      <div className="text-center px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700 hover:bg-slate-50 transition-colors">
                        Fair
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" value="Poor" {...registerReturn('condition')} className="peer sr-only" />
                      <div className="text-center px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 hover:bg-slate-50 transition-colors">
                        Poor
                      </div>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Return Notes</Label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                    <textarea 
                      rows="3"
                      placeholder="Note any damages, missing accessories, or reason for return..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
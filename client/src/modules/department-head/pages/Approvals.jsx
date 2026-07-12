import React, { useState } from 'react';
import { Check, X, Clock, FileText, ChevronRight } from 'lucide-react';
import { useDeptHead } from '../store/DeptHeadContext';

const RequestCard = ({ request, onApprove, onReject }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg flex-shrink-0 ${
          request.type === 'Asset Allocation' ? 'bg-blue-100 text-blue-600' :
          request.type === 'Asset Transfer' ? 'bg-purple-100 text-purple-600' :
          'bg-amber-100 text-amber-600'
        }`}>
          <FileText size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-900">{request.id}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{request.type}</span>
          </div>
          <h3 className="text-base font-medium text-slate-800">{request.asset}</h3>
          <p className="text-sm text-slate-500 mt-1">Requested by <span className="font-medium text-slate-700">{request.requester}</span> ({request.department})</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:items-end gap-3">
        <div className="flex items-center text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
          <Clock size={12} className="mr-1.5" />
          {request.date}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onReject(request.id)}
            className="px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
          >
            <X size={16} /> Reject
          </button>
          <button 
            onClick={() => onApprove(request.id)}
            className="px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
          >
            <Check size={16} /> Approve
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Approvals = () => {
  const { requests, approveRequest, rejectRequest } = useDeptHead();

  const handleApprove = (id) => {
    approveRequest(id);
  };

  const handleReject = (id) => {
    rejectRequest(id);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pending Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">Review and manage asset requests from your department.</p>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button className="px-4 py-3 text-sm font-medium text-primary-600 border-b-2 border-primary-600">
          Action Required ({requests.length})
        </button>
        <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
          Recently Processed
        </button>
      </div>

      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map(req => (
            <RequestCard 
              key={req.id} 
              request={req} 
              onApprove={handleApprove} 
              onReject={handleReject} 
            />
          ))
        ) : (
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
            <p className="text-sm text-slate-500 mt-1">There are no pending requests requiring your approval at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;

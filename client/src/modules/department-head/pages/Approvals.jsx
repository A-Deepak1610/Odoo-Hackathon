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
        
        {request.status === 'Pending' ? (
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
        ) : (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
            request.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {request.status === 'Approved' ? <Check size={16} /> : <X size={16} />}
            {request.status}
          </span>
        )}
      </div>
    </div>
  </div>
);

const Approvals = () => {
  const { requests, processedRequests, approveRequest, rejectRequest } = useDeptHead();
  const [activeTab, setActiveTab] = useState('pending');

  const handleApprove = (id) => {
    approveRequest(id);
  };

  const handleReject = (id) => {
    rejectRequest(id);
  };

  const displayRequests = activeTab === 'pending' ? requests : processedRequests;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pending Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">Review and manage asset requests from your department.</p>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'pending' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Action Required ({requests.length})
        </button>
        <button 
          onClick={() => setActiveTab('processed')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'processed' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Recently Processed ({processedRequests.length})
        </button>
      </div>

      <div className="space-y-4">
        {displayRequests.length > 0 ? (
          displayRequests.map(req => (
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
              {activeTab === 'pending' ? <Check size={32} /> : <FileText size={32} />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {activeTab === 'pending' ? 'All caught up!' : 'No processed requests'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {activeTab === 'pending' 
                ? 'There are no pending requests requiring your approval at this time.' 
                : 'You have not processed any requests yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;

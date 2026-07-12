import React, { useState } from 'react';
import { Check, FileText } from 'lucide-react';
import { useDeptHead } from '../store/DeptHeadContext';
import RequestCard from '../components/RequestCard';

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

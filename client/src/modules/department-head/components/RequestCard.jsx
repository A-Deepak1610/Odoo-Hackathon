import React from 'react';
import { Check, X, Clock, FileText } from 'lucide-react';

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

export default RequestCard;

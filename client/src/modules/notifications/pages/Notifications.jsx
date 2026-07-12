import React from 'react';
import { Bell, AlertCircle, Wrench, CheckCircle, ArrowRightLeft } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import { cn } from '../../../shared/utils/cn';

const mockNotifications = [
  { id: 1, type: 'alert', title: 'Asset Overdue', message: 'Dell XPS 15 (AST-1043) is 2 days overdue from Tom Hanks.', time: '2 hours ago', unread: true, icon: AlertCircle, color: 'text-red-600 bg-red-100' },
  { id: 2, type: 'maintenance', title: 'Maintenance Request Approved', message: 'Request MNT-4021 for HVAC System has been approved.', time: '4 hours ago', unread: true, icon: Wrench, color: 'text-amber-600 bg-amber-100' },
  { id: 3, type: 'transfer', title: 'Transfer Request', message: 'Sarah Jenkins requested transfer of Projector A1.', time: '1 day ago', unread: false, icon: ArrowRightLeft, color: 'text-blue-600 bg-blue-100' },
  { id: 4, type: 'success', title: 'Audit Completed', message: 'Q1 Comprehensive Asset Audit has been marked as completed.', time: '2 days ago', unread: false, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
];

const Notifications = () => {
  return (
    <div className="p-8 pb-20 max-w-4xl mx-auto">
      <PageHeader 
        title="Notifications" 
        actions={<Button variant="ghost">Mark all as read</Button>}
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {mockNotifications.map((note) => (
            <div 
              key={note.id} 
              className={cn(
                "p-5 flex items-start gap-4 transition-colors hover:bg-gray-50 cursor-pointer",
                note.unread ? "bg-blue-50/30" : "bg-white"
              )}
            >
              <div className={cn("p-2.5 rounded-full shrink-0 mt-1", note.color)}>
                <note.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={cn("font-medium", note.unread ? "text-gray-900" : "text-gray-700")}>
                    {note.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{note.time}</span>
                </div>
                <p className={cn("text-sm mt-1", note.unread ? "text-gray-700" : "text-gray-500")}>
                  {note.message}
                </p>
              </div>
              {note.unread && (
                <div className="w-2.5 h-2.5 bg-primary-600 rounded-full shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

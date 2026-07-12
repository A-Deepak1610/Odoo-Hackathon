import React, { createContext, useContext, useState } from 'react';

// Initial Mock Data
const INITIAL_ASSETS = [
  { id: 'AF-1042', name: 'MacBook Pro M2', assignee: 'Alex Chen', role: 'Sr. Developer', status: 'Allocated', condition: 'Excellent' },
  { id: 'AF-1089', name: 'Dell UltraSharp 27"', assignee: 'Sarah Jenkins', role: 'Designer', status: 'Allocated', condition: 'Good' },
  { id: 'AF-2011', name: 'Herman Miller Chair', assignee: 'Mike Ross', role: 'QA Engineer', status: 'Under Maintenance', condition: 'Needs Repair' },
  { id: 'AF-3005', name: 'iPad Pro 11"', assignee: 'Unassigned', role: '-', status: 'Available', condition: 'New' },
  { id: 'AF-1045', name: 'ThinkPad X1 Carbon', assignee: 'Emma Watson', role: 'Developer', status: 'Allocated', condition: 'Good' },
];

const INITIAL_REQUESTS = [
  { id: 'REQ-901', type: 'Asset Allocation', asset: 'MacBook Pro M2', requester: 'John Doe', department: 'Engineering', date: '2023-10-25', status: 'Pending' },
  { id: 'REQ-902', type: 'Asset Transfer', asset: 'Dell UltraSharp 27"', requester: 'Jane Smith', department: 'Design', date: '2023-10-26', status: 'Pending' },
  { id: 'REQ-903', type: 'Maintenance', asset: 'Office Chair', requester: 'Mike Ross', department: 'HR', date: '2023-10-27', status: 'Pending' },
];

const INITIAL_RESOURCES = [
  { id: 'RES-1', name: 'Conference Room A', type: 'Room', capacity: 12, amenities: ['Projector', 'Whiteboard', 'Video Conf'], status: 'Available' },
  { id: 'RES-2', name: 'Design Studio Lab', type: 'Lab', capacity: 6, amenities: ['Mac Pros', 'Wacom Cintiq', '3D Printer'], status: 'Booked' },
  { id: 'RES-3', name: 'Portable Projector 4K', type: 'Equipment', capacity: null, amenities: ['HDMI', 'Wireless Cast'], status: 'Available' },
  { id: 'RES-4', name: 'Meeting Pod 1', type: 'Room', capacity: 4, amenities: ['Monitor', 'Whiteboard'], status: 'Available' },
];

const DeptHeadContext = createContext();

export const DeptHeadProvider = ({ children }) => {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [processedRequests, setProcessedRequests] = useState([]);
  const [resources, setResources] = useState(INITIAL_RESOURCES);

  // Actions
  const bookResource = (resourceId, purpose, date) => {
    // 1. Mark resource as Pending
    setResources(prev => prev.map(res => 
      res.id === resourceId ? { ...res, status: 'Pending Approval' } : res
    ));

    // 2. Add to requests
    const resource = resources.find(r => r.id === resourceId);
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Resource Booking',
      asset: resource?.name || 'Unknown Resource',
      requester: 'Current User', // In real app, from Auth Context
      department: 'Engineering',
      date: date || new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const requestAsset = () => {
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Asset Allocation',
      asset: 'Dummy Hardware Request',
      requester: 'Current User',
      department: 'Engineering',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const approveRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Remove from pending requests
    setRequests(prev => prev.filter(req => req.id !== requestId));
    // Add to processed
    setProcessedRequests(prev => [{ ...request, status: 'Approved', processedAt: new Date().toISOString() }, ...prev]);

    // If it was a resource booking, mark the resource as Booked
    if (request.type === 'Resource Booking') {
      setResources(prev => prev.map(res => 
        res.name === request.asset ? { ...res, status: 'Booked' } : res
      ));
    }
  };

  const rejectRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Remove from pending requests
    setRequests(prev => prev.filter(req => req.id !== requestId));
    // Add to processed
    setProcessedRequests(prev => [{ ...request, status: 'Rejected', processedAt: new Date().toISOString() }, ...prev]);

    // If it was a resource booking, revert the resource to Available
    if (request.type === 'Resource Booking') {
      setResources(prev => prev.map(res => 
        res.name === request.asset ? { ...res, status: 'Available' } : res
      ));
    }
  };

  return (
    <DeptHeadContext.Provider value={{
      assets,
      requests,
      processedRequests,
      resources,
      bookResource,
      requestAsset,
      approveRequest,
      rejectRequest
    }}>
      {children}
    </DeptHeadContext.Provider>
  );
};

export const useDeptHead = () => useContext(DeptHeadContext);

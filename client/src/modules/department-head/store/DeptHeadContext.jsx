import React, { createContext, useContext, useState, useEffect } from 'react';

// --- RICH MOCK DATA FOR HACKATHON DEMO ---
const INITIAL_ASSETS = [
  { id: 'AF-1042', name: 'MacBook Pro M3 Max', assignee: 'Alex Chen', role: 'Sr. Developer', status: 'Allocated', condition: 'Excellent' },
  { id: 'AF-1089', name: 'Dell UltraSharp 27" 4K', assignee: 'Sarah Jenkins', role: 'UX Designer', status: 'Allocated', condition: 'Good' },
  { id: 'AF-2011', name: 'Herman Miller Aeron', assignee: 'Mike Ross', role: 'QA Engineer', status: 'Under Maintenance', condition: 'Needs Repair' },
  { id: 'AF-3005', name: 'iPad Pro 12.9"', assignee: 'Unassigned', role: '-', status: 'Available', condition: 'New' },
  { id: 'AF-1045', name: 'ThinkPad X1 Carbon Gen 11', assignee: 'Emma Watson', role: 'Backend Dev', status: 'Allocated', condition: 'Good' },
  { id: 'AF-1046', name: 'Logitech MX Master 3S', assignee: 'Alex Chen', role: 'Sr. Developer', status: 'Allocated', condition: 'Excellent' },
  { id: 'AF-1047', name: 'Standing Desk Pro', assignee: 'Sarah Jenkins', role: 'UX Designer', status: 'Allocated', condition: 'Excellent' },
  { id: 'AF-3006', name: 'Samsung 49" Odyssey', assignee: 'Unassigned', role: '-', status: 'Available', condition: 'Good' },
  { id: 'AF-2012', name: 'Conference Mic Yeti', assignee: 'Mike Ross', role: 'QA Engineer', status: 'Under Maintenance', condition: 'Damaged Cable' },
];

const INITIAL_REQUESTS = [
  { id: 'REQ-901', type: 'Asset Allocation', asset: 'MacBook Pro M3', requester: 'John Doe', department: 'Engineering', date: '2026-10-25', status: 'Pending', reason: 'New hire onboarding hardware.' },
  { id: 'REQ-902', type: 'Asset Transfer', asset: 'Dell UltraSharp 27"', requester: 'Jane Smith', department: 'Design', date: '2026-10-26', status: 'Pending', reason: 'Upgrading from 24" monitor.' },
  { id: 'REQ-903', type: 'Maintenance', asset: 'Office Chair', requester: 'Mike Ross', department: 'HR', date: '2026-10-27', status: 'Pending', reason: 'Armrest is broken and needs replacement.' },
  { id: 'REQ-904', type: 'Asset Allocation', asset: 'Wacom Cintiq Pro', requester: 'Emily Davis', department: 'Design', date: '2026-10-28', status: 'Pending', reason: 'Required for the new 3D modeling project.' },
];

const INITIAL_RESOURCES = [
  { id: 'RES-1', name: 'Conference Room A (Glass)', type: 'Room', capacity: 12, amenities: ['4K Projector', 'Whiteboard', 'Zoom Room Setup'], status: 'Available' },
  { id: 'RES-2', name: 'Design Studio Lab', type: 'Lab', capacity: 6, amenities: ['Mac Studio', 'Wacom Cintiq', '3D Printer'], status: 'Booked' },
  { id: 'RES-3', name: 'Portable Projector 4K', type: 'Equipment', capacity: null, amenities: ['HDMI', 'Wireless Cast', 'Battery Bank'], status: 'Available' },
  { id: 'RES-4', name: 'Meeting Pod 1', type: 'Room', capacity: 4, amenities: ['Curved Monitor', 'Whiteboard'], status: 'Available' },
  { id: 'RES-5', name: 'Server Rack Sandbox', type: 'Lab', capacity: 2, amenities: ['Linux Server', 'Switch', 'Console Cable'], status: 'Under Maintenance' },
];

const INITIAL_PROCESSED = [
  { id: 'REQ-890', type: 'Asset Allocation', asset: 'Magic Keyboard', requester: 'Chris Evans', department: 'Engineering', date: '2026-10-20', status: 'Approved', processedAt: '2026-10-21T09:30:00Z' },
  { id: 'REQ-885', type: 'Resource Booking', asset: 'Conference Room B', requester: 'Sarah Jenkins', department: 'Design', date: '2026-10-18', status: 'Rejected', processedAt: '2026-10-18T14:15:00Z' },
];

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const DeptHeadContext = createContext();

export const DeptHeadProvider = ({ children }) => {
  const [assets, setAssets] = useLocalStorage('dh_assets', INITIAL_ASSETS);
  const [requests, setRequests] = useLocalStorage('dh_requests', INITIAL_REQUESTS);
  const [processedRequests, setProcessedRequests] = useLocalStorage('dh_processed', INITIAL_PROCESSED);
  const [resources, setResources] = useLocalStorage('dh_resources', INITIAL_RESOURCES);
  const [loading, setLoading] = useState(false);

  // Helper to quickly wipe all data for presentation resetting
  const resetAllData = () => {
    window.localStorage.removeItem('dh_assets');
    window.localStorage.removeItem('dh_requests');
    window.localStorage.removeItem('dh_processed');
    window.localStorage.removeItem('dh_resources');
    setAssets(INITIAL_ASSETS);
    setRequests(INITIAL_REQUESTS);
    setProcessedRequests(INITIAL_PROCESSED);
    setResources(INITIAL_RESOURCES);
  };

  // MOCK ACTIONS: Everything below mutates local state instantly for an amazing UX demo

  const bookResource = (resourceId, purpose, date) => {
    // 1. Mark resource as Pending Approval
    setResources(prev => prev.map(res => 
      res.id === resourceId ? { ...res, status: 'Pending Approval' } : res
    ));

    // 2. Add to requests list
    const resource = resources.find(r => r.id === resourceId);
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Resource Booking',
      asset: resource?.name || 'Unknown Resource',
      requester: 'Current User', 
      department: 'Engineering',
      date: date || new Date().toISOString().split('T')[0],
      status: 'Pending',
      reason: purpose
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const requestAsset = (requestData) => {
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Asset Allocation',
      asset: requestData.assetName || 'Hardware Request',
      requester: 'Current User',
      department: 'Engineering',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      reason: requestData.reason || ''
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const approveRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Remove from pending
    setRequests(prev => prev.filter(req => req.id !== requestId));
    // Add to processed
    setProcessedRequests(prev => [{ ...request, status: 'Approved', processedAt: new Date().toISOString() }, ...prev]);

    // If it was a resource booking, update the resource status
    if (request.type === 'Resource Booking') {
      setResources(prev => prev.map(res => 
        res.name === request.asset ? { ...res, status: 'Booked' } : res
      ));
    }
  };

  const rejectRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Remove from pending
    setRequests(prev => prev.filter(req => req.id !== requestId));
    // Add to processed
    setProcessedRequests(prev => [{ ...request, status: 'Rejected', processedAt: new Date().toISOString() }, ...prev]);

    // If it was a resource booking, revert to Available
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
      loading,
      bookResource,
      requestAsset,
      approveRequest,
      rejectRequest,
      resetAllData
    }}>
      {children}
    </DeptHeadContext.Provider>
  );
};

export const useDeptHead = () => useContext(DeptHeadContext);

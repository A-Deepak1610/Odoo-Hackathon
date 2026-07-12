import React, { useState } from 'react';
import { 
  Building2, Tags, Users, Plus, Search, Filter, 
  ClipboardCheck, Pencil, Trash2, X, CheckCircle2, User,
  MoreVertical, Settings, Shield
} from 'lucide-react';
import { DashboardCard } from '../components/dashboard';
import { Button, Input, Select, Label, Badge } from '../components/ui';

// Mock Data
const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Engineering', head: 'Sarah Jenkins', parent: 'None', status: 'Active', budget: '$1.2M', headcount: 45 },
  { id: 2, name: 'Marketing', head: 'Mike Ross', parent: 'None', status: 'Active', budget: '$850K', headcount: 24 },
  { id: 3, name: 'Operations', head: 'David Kim', parent: 'None', status: 'Active', budget: '$2.1M', headcount: 112 },
  { id: 4, name: 'Frontend Web', head: 'Sarah Jenkins', parent: 'Engineering', status: 'Active', budget: '$400K', headcount: 12 },
];

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Laptops - Mac', prefix: 'MAC', count: 145, fields: ['RAM', 'Storage', 'CPU'], active: true },
  { id: 2, name: 'Laptops - Windows', prefix: 'WIN', count: 210, fields: ['RAM', 'Storage', 'GPU'], active: true },
  { id: 3, name: 'Furniture - Desks', prefix: 'DSK', count: 320, fields: ['Dimensions', 'Material'], active: true },
  { id: 4, name: 'Vehicles - Fleet', prefix: 'VEH', count: 12, fields: ['License Plate', 'Mileage'], active: false },
];

const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Tom Hanks', email: 'tom@assetflow.com', dept: 'Marketing', role: 'Employee', status: 'Active' },
  { id: 2, name: 'Sarah Jenkins', email: 'sarah@assetflow.com', dept: 'Engineering', role: 'Department Head', status: 'Active' },
  { id: 3, name: 'Jane Smith', email: 'jane@assetflow.com', dept: 'Operations', role: 'Admin', status: 'Active' },
  { id: 4, name: 'Alex Chen', email: 'alex@assetflow.com', dept: 'Marketing', role: 'Asset Manager', status: 'On Leave' },
];

const INITIAL_AUDITS = [
  { id: 1, name: 'Q1 Comprehensive Audit', scope: 'All Departments', auditors: 'Jane Smith', status: 'Completed', discrepancies: 2 },
  { id: 2, name: 'Q2 IT Infrastructure', scope: 'Engineering', auditors: 'External Team', status: 'In Progress', discrepancies: 0 },
  { id: 3, name: 'Annual Fleet Review', scope: 'Operations', auditors: 'David Kim', status: 'Pending', discrepancies: 0 },
];

const TABS = [
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'categories', label: 'Asset Categories', icon: Tags },
  { id: 'employees', label: 'Employee Directory', icon: Users },
  { id: 'audits', label: 'Audit Cycles', icon: ClipboardCheck },
];

const StatusPill = ({ status }) => {
  const map = {
    'Active': 'success',
    'Completed': 'success',
    'Inactive': 'neutral',
    'Pending': 'warning',
    'On Leave': 'warning',
    'In Progress': 'info'
  };
  return <Badge variant={map[status] || 'neutral'}>{status}</Badge>;
};

const OrganizationPage = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [audits, setAudits] = useState(INITIAL_AUDITS);

  // Modal State
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });

  const openModal = (type, data = null) => {
    setModalConfig({ isOpen: true, type, data });
  };
  const closeModal = () => setModalConfig({ isOpen: false, type: null, data: null });

  // Delete Action Mock
  const handleDelete = (id, type) => {
    if(type === 'departments') setDepartments(prev => prev.filter(x => x.id !== id));
    if(type === 'categories') setCategories(prev => prev.filter(x => x.id !== id));
    if(type === 'employees') setEmployees(prev => prev.filter(x => x.id !== id));
    if(type === 'audits') setAudits(prev => prev.filter(x => x.id !== id));
  };

  const renderContent = () => {
    if (activeTab === 'departments') {
      const filtered = departments.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        <div className="space-y-4">
          {filtered.map(dept => (
            <div key={dept.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{dept.name}</span>
                  <StatusPill status={dept.status} />
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><User size={12}/> {dept.head}</span>
                  <span className="flex items-center gap-1 text-slate-300">•</span>
                  <span>Headcount: {dept.headcount}</span>
                  <span className="flex items-center gap-1 text-slate-300">•</span>
                  <span>Budget: {dept.budget}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" className="h-8 w-8 p-0" onClick={() => openModal('departments', dept)}><Pencil size={14}/></Button>
                <Button variant="danger" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(dept.id, 'departments')}><Trash2 size={14}/></Button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'categories') {
      const filtered = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(cat => (
            <div key={cat.id} className="p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-100">{cat.prefix}</span>
                  <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal('categories', cat)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50"><Pencil size={14}/></button>
                  <button onClick={() => handleDelete(cat.id, 'categories')} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"><Trash2 size={14}/></button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-xs">
                <div className="flex gap-1.5">
                  {cat.fields.map((f, i) => <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{f}</span>)}
                </div>
                <span className="font-bold text-slate-700">{cat.count} assets</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'employees') {
      const filtered = employees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.email.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-slate-500 text-xs font-medium">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-700">{emp.dept}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5">
                      {emp.role === 'Admin' || emp.role === 'Superadmin' ? <Shield size={14} className="text-indigo-500" /> : <User size={14} className="text-slate-400" />}
                      <span className="font-semibold text-slate-700">{emp.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3"><StatusPill status={emp.status} /></td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0" onClick={() => openModal('employees', emp)}><Settings size={14}/></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'audits') {
      const filtered = audits.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        <div className="space-y-4">
          {filtered.map(audit => (
            <div key={audit.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{audit.name}</span>
                  <StatusPill status={audit.status} />
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><Users size={12}/> Scope: {audit.scope}</span>
                  <span className="flex items-center gap-1 text-slate-300">•</span>
                  <span>Auditors: {audit.auditors}</span>
                  <span className="flex items-center gap-1 text-slate-300">•</span>
                  <span className={audit.discrepancies > 0 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {audit.discrepancies} Discrepancies
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" className="h-8 px-3 text-xs" onClick={() => openModal('audits', audit)}>View Details</Button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Organization Setup
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Maintain the master data everything else depends on. Manage departments, categories, and staff directory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DashboardCard title="Organizational Master Data">
          
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6 mt-2">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar shrink-0">
              {TABS.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? 'text-blue-200' : 'text-slate-400'} />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-50 border-slate-200 w-full"
                />
              </div>
              <Button className="shrink-0 gap-2" onClick={() => openModal(activeTab)}>
                <Plus size={16} /> 
                Add New
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px] bg-slate-50/50 rounded-xl border border-slate-100 p-4">
            {renderContent()}
          </div>
          
        </DashboardCard>
      </div>

      {/* Global Generic Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-lg capitalize">
                {modalConfig.data ? 'Edit' : 'Add'} {modalConfig.type?.replace(/s$/, '') || 'Item'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1 rounded-md transition-colors"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm font-medium text-blue-800 text-center">
                  Form configuration dynamically rendered based on entity type.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input defaultValue={modalConfig.data?.name || ''} />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={closeModal} className="gap-2 text-white">
                <CheckCircle2 size={16} /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrganizationPage;

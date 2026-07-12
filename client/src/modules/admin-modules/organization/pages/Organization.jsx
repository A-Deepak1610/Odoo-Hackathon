import React, { useState, useEffect } from 'react';
import { Building2, Tags, Users, Plus, MoreHorizontal, Search, Filter, ClipboardCheck, Pencil, Trash2, Loader2 } from 'lucide-react';
import PageHeader from '../../../../shared/components/PageHeader';
import Tabs from '../../../../shared/components/Tabs';
import DataTable from '../../../../shared/components/DataTable';
import StatusPill from '../../../../shared/components/StatusPill';
import Button from '../../../../shared/components/Button';
import Modal from '../../../../shared/components/Modal';
import { apiFetch } from '../../../../services/api';

// --- INITIAL MOCK DATA ---
const initialDepartments = [
  { id: 1, name: 'Engineering', head: 'Sarah Jenkins', parent: 'None', status: 'Active' },
  { id: 2, name: 'Marketing', head: 'Mike Ross', parent: 'None', status: 'Active' },
  { id: 3, name: 'Operations', head: 'David Kim', parent: 'None', status: 'Active' },
];

const initialCategories = [
  { id: 1, name: 'Laptops - Mac', prefix: 'MAC', count: 145, fields: 'RAM, Storage, CPU' },
  { id: 2, name: 'Laptops - Windows', prefix: 'WIN', count: 210, fields: 'RAM, Storage, CPU' },
];

const initialEmployees = [
  { id: 1, name: 'Tom Hanks', email: 'tom@acme.com', dept: 'Marketing', role: 'Employee', status: 'Active' },
  { id: 2, name: 'Sarah Jenkins', email: 'sarah@acme.com', dept: 'Engineering', role: 'Department Head', status: 'Active' },
  { id: 3, name: 'Jane Smith', email: 'jane@acme.com', dept: 'Operations', role: 'Admin', status: 'Active' },
];

const initialAuditCycles = [
  { id: 1, name: 'Q1 Comprehensive Audit', scope: 'All Departments', auditors: 'Jane Smith', status: 'Completed', discrepancies: 2 },
  { id: 2, name: 'Q2 IT Infrastructure', scope: 'Engineering', auditors: 'External Team', status: 'In Progress', discrepancies: 0 },
];

const tabs = [
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'categories', label: 'Asset Categories', icon: Tags },
  { id: 'employees', label: 'Employee Directory', icon: Users },
  { id: 'audits', label: 'Audit Cycles', icon: ClipboardCheck },
];

const Organization = () => {
  const [activeTab, setActiveTab] = useState('departments');

  // --- STATE ---
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [auditCycles, setAuditCycles] = useState(initialAuditCycles);

  // Lists loaded from backend
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [empRes, orgRes, catRes] = await Promise.all([
        apiFetch('/api/v1/employees'),
        apiFetch('/api/v1/organization'),
        apiFetch('/api/v1/asset-categories')
      ]);
      
      const empData = await empRes.json();
      const orgData = await orgRes.json();
      const catData = await catRes.json();
      
      if (empRes.ok && orgRes.ok && catRes.ok) {
        setEmployees(empData.data || []);
        const depts = orgData.data?.departments || [];
        setDepartmentsList(depts);
        
        // Map database departments to department tab structure
        const mappedDepts = depts.map(d => ({
          id: d.id,
          name: d.name,
          head: d.headId ? 'Department Head' : 'Unassigned',
          parent: d.parentDepartmentId || 'None',
          status: d.isActive ? 'Active' : 'Inactive'
        }));
        setDepartments(mappedDepts);

        // Map database categories to categories tab structure
        const cats = catData.data || [];
        const mappedCats = cats.map(c => ({
          id: c.id,
          name: c.name,
          prefix: c.name.substring(0, 3).toUpperCase(),
          count: c.assets?.length || 0,
          fields: c.description || 'General Attributes'
        }));
        setCategories(mappedCats);
      } else {
        setError(empData.message || orgData.message || "Failed to load directory.");
      }
    } catch (err) {
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- SEARCH STATE ---
  const [searchQueries, setSearchQueries] = useState({
    departments: '', categories: '', employees: '', audits: ''
  });

  const handleSearchChange = (val) => {
    setSearchQueries(prev => ({ ...prev, [activeTab]: val }));
  };

  // --- MODAL STATE ---
  const [modalState, setModalState] = useState({ type: null, item: null }); 
  const closeModal = () => setModalState({ type: null, item: null });

  // --- FORM STATES ---
  const [deptForm, setDeptForm] = useState({ name: '', head: '', parent: 'None', status: 'Active' });
  const [catForm, setCatForm] = useState({ name: '', prefix: '', fields: '' });
  const [empForm, setEmpForm] = useState({ name: '', email: '', departmentId: '', role: 'EMPLOYEE', isActive: true });
  const [auditForm, setAuditForm] = useState({ name: '', scope: '', auditors: '', status: 'Pending', discrepancies: 0 });

  // Open modal handlers
  const openModal = (type, item = null) => {
    setModalState({ type, item });
    if (type === 'departments') {
      setDeptForm(item || { name: '', head: '', parent: 'None', status: 'Active' });
    } else if (type === 'categories') {
      setCatForm(item || { name: '', prefix: '', fields: '' });
    } else if (type === 'employees') {
      setEmpForm(item ? {
        name: item.name,
        email: item.email,
        departmentId: item.departmentId || '',
        role: item.role,
        isActive: item.isActive
      } : { name: '', email: '', departmentId: '', role: 'EMPLOYEE', isActive: true });
    } else if (type === 'audits') {
      setAuditForm(item || { name: '', scope: '', auditors: '', status: 'Pending', discrepancies: 0 });
    }
  };

  // Save handlers
  const handleSaveDepartment = () => {
    if (modalState.item) {
      setDepartments(departments.map(d => d.id === modalState.item.id ? { ...d, ...deptForm } : d));
    } else {
      setDepartments([...departments, { id: Date.now(), ...deptForm }]);
    }
    closeModal();
  };

  const handleSaveCategory = () => {
    if (modalState.item) {
      setCategories(categories.map(c => c.id === modalState.item.id ? { ...c, ...catForm } : c));
    } else {
      setCategories([...categories, { id: Date.now(), count: 0, ...catForm }]);
    }
    closeModal();
  };

  const handleSaveEmployee = async () => {
    const isEdit = !!modalState.item;
    const body = {
      name: empForm.name,
      email: empForm.email,
      departmentId: empForm.departmentId || null,
      role: empForm.role,
      isActive: empForm.isActive
    };

    try {
      let res;
      if (isEdit) {
        res = await apiFetch(`/api/v1/employees/${modalState.item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        res = await apiFetch('/api/v1/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }
      
      const result = await res.json();
      if (res.ok && result.success) {
        await loadData();
        closeModal();
      } else {
        alert(result.message || "Failed to save employee.");
      }
    } catch (err) {
      alert("Network error occurred.");
    }
  };

  const handleSaveAudit = () => {
    if (modalState.item) {
      setAuditCycles(auditCycles.map(a => a.id === modalState.item.id ? { ...a, ...auditForm } : a));
    } else {
      setAuditCycles([...auditCycles, { id: Date.now(), ...auditForm }]);
    }
    closeModal();
  };

  // Inline Role Change
  const updateEmployeeRole = async (id, newRole) => {
    try {
      const res = await apiFetch(`/api/v1/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setEmployees(employees.map(e => e.id === id ? { ...e, role: newRole } : e));
      } else {
        alert(result.message || "Failed to update role.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const deleteItem = async (tab, id) => {
    if (tab === 'employees') {
      if (!window.confirm("Are you sure you want to delete this employee?")) return;
      try {
        const res = await apiFetch(`/api/v1/employees/${id}`, {
          method: 'DELETE'
        });
        const result = await res.json();
        if (res.ok && result.success) {
          setEmployees(employees.filter(e => e.id !== id));
        } else {
          alert(result.message || "Failed to delete employee.");
        }
      } catch (err) {
        alert("Network error.");
      }
    } else {
      if (tab === 'departments') setDepartments(departments.filter(d => d.id !== id));
      if (tab === 'categories') setCategories(categories.filter(c => c.id !== id));
      if (tab === 'audits') setAuditCycles(auditCycles.filter(a => a.id !== id));
    }
  };

  // Action Cell Renderer
  const renderActions = (tab, row) => (
    <div className="flex justify-end gap-2">
      <button onClick={() => openModal(tab, row)} className="text-gray-400 hover:text-primary-600 transition-colors p-1.5 rounded hover:bg-primary-50">
        <Pencil size={16} />
      </button>
      <button onClick={() => deleteItem(tab, row.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50">
        <Trash2 size={16} />
      </button>
    </div>
  );

  // Toolbar
  const renderToolbar = (title, desc, buttonText, tabId) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQueries[tabId]}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <Button onClick={() => openModal(tabId)} icon={Plus} size="sm">{buttonText}</Button>
      </div>
    </div>
  );

  // Content Rendering
  const renderContent = () => {
    switch (activeTab) {
      case 'departments':
        const filteredDepts = departments.filter(d => d.name.toLowerCase().includes(searchQueries.departments.toLowerCase()));
        return (
          <div className="space-y-4">
            {renderToolbar("Department Management", "Configure organizational hierarchy.", "Add Department", "departments")}
            <DataTable 
              data={filteredDepts}
              columns={[
                { header: 'Department Name', accessor: 'name', cellClassName: 'font-medium text-gray-900' },
                { header: 'Head of Department', accessor: 'head' },
                { header: 'Parent', accessor: 'parent' },
                { header: 'Status', cell: (row) => <StatusPill status={row.status} /> },
                { header: 'Actions', cell: (row) => renderActions('departments', row), className: 'text-right' }
              ]}
            />
          </div>
        );
      case 'categories':
        const filteredCats = categories.filter(c => c.name.toLowerCase().includes(searchQueries.categories.toLowerCase()));
        return (
          <div className="space-y-4">
            {renderToolbar("Asset Categories", "Define asset types and fields.", "Add Category", "categories")}
            <DataTable 
              data={filteredCats}
              columns={[
                { header: 'Category Name', accessor: 'name', cellClassName: 'font-medium text-gray-900' },
                { header: 'Prefix', accessor: 'prefix', cellClassName: 'font-mono text-primary-700 bg-primary-50 px-2 py-1 rounded inline-block text-xs font-semibold' },
                { header: 'Count', accessor: 'count' },
                { header: 'Custom Fields', accessor: 'fields', cellClassName: 'text-xs text-gray-500' },
                { header: 'Actions', cell: (row) => renderActions('categories', row), className: 'text-right' }
              ]}
            />
          </div>
        );
      case 'employees':
        const filteredEmps = employees.filter(e => e.name.toLowerCase().includes(searchQueries.employees.toLowerCase()) || e.email.toLowerCase().includes(searchQueries.employees.toLowerCase()));
        return (
          <div className="space-y-4">
            {renderToolbar("Employee Directory", "Manage staff access and roles.", "Invite Employee", "employees")}
            <DataTable 
              data={filteredEmps}
              columns={[
                { 
                  header: 'Employee', 
                  cell: (row) => (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {row.name ? row.name.split(' ').map(n => n ? n[0] : '').join('') : 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{row.name}</div>
                        <div className="text-gray-500 text-xs">{row.email}</div>
                      </div>
                    </div>
                  )
                },
                { header: 'Department', cell: (row) => row.department?.name || 'Unassigned' },
                { 
                  header: 'Role Assignment', 
                  cell: (row) => (
                    <select 
                      value={row.role}
                      onChange={(e) => updateEmployeeRole(row.id, e.target.value)}
                      className="text-xs font-medium bg-gray-50 border border-gray-300 text-gray-800 py-1.5 pl-2 pr-6 rounded-md focus:ring-primary-500 focus:border-primary-500 hover:bg-gray-100 transition-colors"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="ASSET_MANAGER">Asset Manager</option>
                      <option value="DEPARTMENT_HEAD">Department Head</option>
                      <option value="EMPLOYEE">Employee</option>
                      <option value="SUPERADMIN">Super Admin</option>
                    </select>
                  )
                },
                { header: 'Status', cell: (row) => <StatusPill status={row.isActive ? 'Active' : 'Inactive'} /> },
                { header: 'Actions', cell: (row) => renderActions('employees', row), className: 'text-right' }
              ]}
            />
          </div>
        );
      case 'audits':
        const filteredAudits = auditCycles.filter(a => a.name.toLowerCase().includes(searchQueries.audits.toLowerCase()));
        return (
          <div className="space-y-4">
            {renderToolbar("Audit Cycles", "Run structured verification cycles.", "New Audit Cycle", "audits")}
            <DataTable 
              data={filteredAudits}
              columns={[
                { header: 'Audit Name', accessor: 'name', cellClassName: 'font-medium text-gray-900' },
                { header: 'Scope', accessor: 'scope' },
                { header: 'Auditors', accessor: 'auditors' },
                { header: 'Discrepancies', accessor: 'discrepancies', cellClassName: 'text-center font-semibold text-red-600' },
                { header: 'Status', cell: (row) => <StatusPill status={row.status} /> },
                { header: 'Actions', cell: (row) => renderActions('audits', row), className: 'text-right' }
              ]}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8 pb-20 max-w-7xl mx-auto font-sans flex flex-col items-center justify-center min-height-[60vh] gap-4">
        <Loader2 size={36} className="animate-spin text-primary-600" />
        <p className="text-gray-500 text-sm font-medium">Loading organization dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 pb-20 max-w-7xl mx-auto font-sans flex flex-col items-center justify-center min-height-[60vh] gap-4 text-center">
        <AlertTriangle size={36} className="text-red-500" />
        <h3 className="text-lg font-bold text-gray-900">Failed to Load Setup Directory</h3>
        <p className="text-gray-500 text-sm max-w-md">{error}</p>
        <Button onClick={loadData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto font-sans">
      <PageHeader 
        title="Organization Setup" 
        description="Maintain the master data everything else depends on. Manage departments, categories, and staff directory."
      />
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-6 bg-gray-50/30">
          {renderContent()}
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* Department Modal */}
      <Modal
        isOpen={modalState.type === 'departments'}
        onClose={closeModal}
        title={modalState.item ? 'Edit Department' : 'Add Department'}
        footer={<><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button onClick={handleSaveDepartment}>Save</Button></>}
      >
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} className="w-full p-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Head of Department</label><input value={deptForm.head} onChange={e => setDeptForm({...deptForm, head: e.target.value})} className="w-full p-2 border rounded-md" /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={deptForm.status} onChange={e => setDeptForm({...deptForm, status: e.target.value})} className="w-full p-2 border rounded-md">
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Categories Modal */}
      <Modal
        isOpen={modalState.type === 'categories'}
        onClose={closeModal}
        title={modalState.item ? 'Edit Category' : 'Add Category'}
        footer={<><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button onClick={handleSaveCategory}>Save</Button></>}
      >
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label><input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="w-full p-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Prefix (e.g. LPT)</label><input value={catForm.prefix} onChange={e => setCatForm({...catForm, prefix: e.target.value})} className="w-full p-2 border rounded-md uppercase" maxLength={4}/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Custom Fields (comma separated)</label><input value={catForm.fields} onChange={e => setCatForm({...catForm, fields: e.target.value})} className="w-full p-2 border rounded-md" /></div>
        </div>
      </Modal>

      {/* Employees Modal */}
      <Modal
        isOpen={modalState.type === 'employees'}
        onClose={closeModal}
        title={modalState.item ? 'Edit Employee' : 'Invite Employee'}
        footer={<><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button onClick={handleSaveEmployee}>Save</Button></>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} required className="w-full p-2 border rounded-md" placeholder="e.g. Mike Ross" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} required className="w-full p-2 border rounded-md" placeholder="e.g. mike@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select 
              value={empForm.departmentId} 
              onChange={e => setEmpForm({...empForm, departmentId: e.target.value})} 
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Unassigned / General --</option>
              {departmentsList.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Role</label>
            <select 
              value={empForm.role} 
              onChange={e => setEmpForm({...empForm, role: e.target.value})} 
              className="w-full p-2 border rounded-md"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="DEPARTMENT_HEAD">Department Head</option>
              <option value="ASSET_MANAGER">Asset Manager</option>
              <option value="ADMIN">Tenant Admin</option>
              <option value="SUPERADMIN">Super Admin</option>
            </select>
          </div>
          {modalState.item && (
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="empActive" 
                checked={empForm.isActive} 
                onChange={e => setEmpForm({...empForm, isActive: e.target.checked})} 
                className="cursor-pointer"
              />
              <label htmlFor="empActive" className="text-sm font-medium text-gray-700 cursor-pointer">Active / Enabled Access</label>
            </div>
          )}
        </div>
      </Modal>

      {/* Audits Modal */}
      <Modal
        isOpen={modalState.type === 'audits'}
        onClose={closeModal}
        title={modalState.item ? 'Edit Audit Cycle' : 'New Audit Cycle'}
        footer={<><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button onClick={handleSaveAudit}>Save</Button></>}
      >
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Audit Name</label><input value={auditForm.name} onChange={e => setAuditForm({...auditForm, name: e.target.value})} className="w-full p-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Scope</label><input value={auditForm.scope} onChange={e => setAuditForm({...auditForm, scope: e.target.value})} className="w-full p-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Assigned Auditors</label><input value={auditForm.auditors} onChange={e => setAuditForm({...auditForm, auditors: e.target.value})} className="w-full p-2 border rounded-md" /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={auditForm.status} onChange={e => setAuditForm({...auditForm, status: e.target.value})} className="w-full p-2 border rounded-md">
              <option>Pending</option><option>In Progress</option><option>Completed</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Organization;

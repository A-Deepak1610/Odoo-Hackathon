import React, { useState } from 'react';
import { Building2, Tags, Users, ShieldAlert, Plus, MoreHorizontal } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import Tabs from '../../../shared/components/Tabs';
import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import Button from '../../../shared/components/Button';

const tabs = [
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'categories', label: 'Asset Categories', icon: Tags },
  { id: 'employees', label: 'Employee Directory', icon: Users },
  { id: 'roles', label: 'Roles & Access', icon: ShieldAlert },
];

const mockDepartments = [
  { id: 1, name: 'Engineering', head: 'Sarah Jenkins', parent: 'None', status: 'Active' },
  { id: 2, name: 'Marketing', head: 'Mike Ross', parent: 'None', status: 'Active' },
  { id: 3, name: 'QA', head: 'Elena Gilbert', parent: 'Engineering', status: 'Inactive' },
];

const mockCategories = [
  { id: 1, name: 'Laptops', prefix: 'LPT', count: 145, fields: 'RAM, Storage, CPU' },
  { id: 2, name: 'Vehicles', prefix: 'VEH', count: 12, fields: 'License Plate, Mileage' },
  { id: 3, name: 'Furniture', prefix: 'FURN', count: 340, fields: 'Color, Material' },
];

const mockEmployees = [
  { id: 1, name: 'Tom Hanks', email: 'tom@acme.com', dept: 'Marketing', role: 'Employee', status: 'Active' },
  { id: 2, name: 'Sarah Jenkins', email: 'sarah@acme.com', dept: 'Engineering', role: 'Department Head', status: 'Active' },
  { id: 3, name: 'Jane Smith', email: 'jane@acme.com', dept: 'IT', role: 'Asset Manager', status: 'Active' },
];

const mockRoles = [
  { role: 'Admin', desc: 'Full access to all settings, billing, and org structure.', users: 2 },
  { role: 'Asset Manager', desc: 'Can add, edit, and transfer any assets across the org.', users: 4 },
  { role: 'Department Head', desc: 'Can manage allocations and approvals for their department.', users: 8 },
  { role: 'Employee', desc: 'Can request assets, book resources, and view their allocations.', users: 145 },
];

const Organization = () => {
  const [activeTab, setActiveTab] = useState('departments');

  const renderContent = () => {
    switch (activeTab) {
      case 'departments':
        return (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button icon={Plus} size="sm">Add Department</Button>
            </div>
            <DataTable 
              data={mockDepartments}
              columns={[
                { header: 'Department Name', accessor: 'name' },
                { header: 'Head of Department', accessor: 'head' },
                { header: 'Parent Department', accessor: 'parent' },
                { 
                  header: 'Status', 
                  accessor: 'status',
                  cell: (row) => <StatusPill status={row.status} /> 
                },
                {
                  header: 'Actions',
                  cell: () => <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18}/></button>,
                  className: 'text-right',
                  cellClassName: 'text-right'
                }
              ]}
            />
          </div>
        );
      case 'categories':
        return (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button icon={Plus} size="sm">Add Category</Button>
            </div>
            <DataTable 
              data={mockCategories}
              columns={[
                { header: 'Category Name', accessor: 'name' },
                { header: 'Prefix', accessor: 'prefix', cellClassName: 'font-mono text-gray-500' },
                { header: 'Asset Count', accessor: 'count' },
                { header: 'Custom Fields Config', accessor: 'fields', cellClassName: 'text-gray-500 text-xs' },
                {
                  header: 'Actions',
                  cell: () => <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18}/></button>,
                  className: 'text-right',
                  cellClassName: 'text-right'
                }
              ]}
            />
          </div>
        );
      case 'employees':
        return (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button icon={Plus} size="sm">Invite Employee</Button>
            </div>
            <DataTable 
              data={mockEmployees}
              columns={[
                { 
                  header: 'Employee', 
                  cell: (row) => (
                    <div>
                      <div className="font-medium text-gray-900">{row.name}</div>
                      <div className="text-gray-500 text-xs">{row.email}</div>
                    </div>
                  )
                },
                { header: 'Department', accessor: 'dept' },
                { 
                  header: 'Role', 
                  cell: (row) => (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{row.role}</span>
                      <button className="text-primary-600 hover:text-primary-800 text-xs font-medium ml-2">Change</button>
                    </div>
                  )
                },
                { 
                  header: 'Status', 
                  accessor: 'status',
                  cell: (row) => <StatusPill status={row.status} /> 
                },
              ]}
            />
          </div>
        );
      case 'roles':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100">
              <strong>Admin Control:</strong> This matrix shows capabilities assigned to each role. Only Admins can modify these settings.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRoles.map((role, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{role.role}</h3>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{role.users} Users</span>
                    </div>
                    <p className="text-sm text-gray-500">{role.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">View Permissions Matrix</span>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <PageHeader 
        title="Organization Setup" 
        description="Manage your organization structure, asset categories, and user access levels."
      />
      
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Organization;

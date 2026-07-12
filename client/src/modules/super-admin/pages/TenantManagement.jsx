import React, { useState } from 'react';
import { Plus, MoreVertical, Search, ShieldAlert, Trash2 } from 'lucide-react';
import { useSuperAdmin } from '../store/SuperAdminContext';
import Button from '../../../shared/components/Button';

const TenantManagement = () => {
  const { tenants, addTenant, suspendTenant, removeTenant } = useSuperAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTenantId, setExpandedTenantId] = useState(null);

  // Form State
  const [tenantName, setTenantName] = useState('');
  const [domain, setDomain] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!tenantName || !domain || !adminEmail) return;
    
    addTenant({ name: tenantName, domain, adminEmail });
    setIsModalOpen(false);
    setTenantName('');
    setDomain('');
    setAdminEmail('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tenant Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage workspaces, domains, and global configurations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Add New Tenant
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tenants by name or domain..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">Tenant Name</th>
                <th className="px-6 py-4 font-semibold">Domain</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Users</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.length > 0 ? (
                filteredTenants.map(tenant => (
                  <React.Fragment key={tenant.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{tenant.name}</div>
                        <div className="text-xs text-slate-500">{tenant.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{tenant.domain}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          tenant.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {tenant.usersCount}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setExpandedTenantId(expandedTenantId === tenant.id ? null : tenant.id)}
                          className={`p-1.5 rounded transition-colors ${
                            expandedTenantId === tenant.id ? 'bg-primary-100 text-primary-700' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'
                          }`}
                        >
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                    {expandedTenantId === tenant.id && (
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                              <span className="block mb-1"><strong className="text-slate-900">Admin Email:</strong> {tenant.adminEmail}</span>
                              <span className="block"><strong className="text-slate-900">Created:</strong> {tenant.createdAt}</span>
                            </div>
                            <div className="flex gap-3">
                              <button 
                                onClick={() => suspendTenant(tenant.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                                  tenant.status === 'Active' ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                <ShieldAlert size={16} /> {tenant.status === 'Active' ? 'Suspend Tenant' : 'Activate Tenant'}
                              </button>
                              <button 
                                onClick={() => removeTenant(tenant.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No tenants found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Add New Tenant</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="e.g. Acme Corp" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain</label>
                <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
                  <input 
                    type="text" 
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="acme" 
                    className="w-full px-4 py-2 text-sm focus:outline-none"
                  />
                  <div className="bg-slate-50 border-l border-slate-300 px-3 py-2 text-sm text-slate-500">
                    .assetflow.com
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
                <input 
                  type="email" 
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@acmecorp.com" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="w-full">
                  Cancel
                </Button>
                <Button type="submit" className="w-full">
                  Create Tenant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;

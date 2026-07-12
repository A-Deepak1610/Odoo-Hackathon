<<<<<<< HEAD
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
=======
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
import { 
  ArrowLeft, Edit, Trash2, Image as ImageIcon, FileText, 
  MapPin, Box, Hash, Calendar, DollarSign, Activity,
  Building2, Wrench, Clock, CheckCircle2
} from 'lucide-react';
import { DashboardCard, ActivityCard } from '../components/dashboard';
import { AssetStatusBadge } from '../components/assets';
import { Button, Badge } from '../components/ui';
<<<<<<< HEAD

// Placeholder data
const ASSET = {
  id: 'AST-2024-001',
  name: 'MacBook Pro 16" M3 Max',
  category: 'Electronics',
  tag: 'AST-2024-001',
  serialNumber: 'C02F9823J9X',
  status: 'Allocated',
  condition: 'Good',
  location: 'Building A, Floor 3',
  acquisitionDate: '2024-01-15',
  acquisitionCost: 3499.00,
  isBookable: false,
  holder: {
    name: 'Sarah Jenkins',
    role: 'Senior Developer',
    email: 'sarah.j@assertflow.com'
  },
  department: 'Engineering',
  lifecycle: {
    expectedLifespan: '4 Years',
    currentValue: 2800.00
  }
};

const AssetDetailsPage = () => {
  const { assetId } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

=======
import { getAssetByIdApi } from '../api';

const AssetDetailsPage = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadAsset = async () => {
      setIsLoading(true);
      try {
        const res = await getAssetByIdApi(assetId);
        if (res.success) {
          setAsset(res.data);
        } else {
          console.error("Asset not found");
        }
      } catch (err) {
        console.error("Failed to load asset details", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (assetId) loadAsset();
  }, [assetId]);

  if (isLoading) {
    return <div className="p-6 text-center text-slate-500">Loading asset details...</div>;
  }

  if (!asset) {
    return <div className="p-6 text-center text-red-500">Asset not found.</div>;
  }

  // Safely mapping data
  const categoryName = asset.category?.name || 'Uncategorized';
  const holderName = asset.currentEmployee?.name || 'Unassigned';
  const holderRole = asset.currentEmployee?.role || 'N/A';
  const holderEmail = asset.currentEmployee?.email || 'N/A';
  const departmentName = asset.currentDepartment?.name || 'Unassigned';
  const displayStatus = asset.status === 'AVAILABLE' ? 'Available' : asset.status === 'ALLOCATED' ? 'Allocated' : asset.status === 'UNDER_MAINTENANCE' ? 'In Maintenance' : asset.status === 'LOST' ? 'Missing' : asset.status;


>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Link to="/asset-manager/directory" className="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm bg-white">
            <ArrowLeft size={18} />
          </Link>
          <div>
<<<<<<< HEAD
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{ASSET.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{ASSET.tag}</span>
              <AssetStatusBadge status={ASSET.status} />
=======
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{asset.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{asset.assetTag}</span>
              <AssetStatusBadge status={displayStatus} />
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none gap-2" onClick={() => setIsEditModalOpen(true)}>
            <Edit size={16} />
            <span>Edit Asset</span>
          </Button>
          <Button variant="danger" className="flex-1 sm:flex-none gap-2" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Main Details */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Basic Information & Image */}
          <DashboardCard title="Basic Information">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image Placeholder */}
              <div className="w-full md:w-64 h-48 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 shrink-0">
                <ImageIcon size={40} className="mb-3 text-slate-300" />
                <span className="text-sm font-medium">No Image Available</span>
              </div>
              
              {/* Details Grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Asset Name</div>
<<<<<<< HEAD
                  <div className="text-sm font-semibold text-slate-900">{ASSET.name}</div>
=======
                  <div className="text-sm font-semibold text-slate-900">{asset.name}</div>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Box size={16} className="text-blue-500" />
<<<<<<< HEAD
                    {ASSET.category}
=======
                    {categoryName}
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Serial Number</div>
                  <div className="flex items-center gap-2 text-sm font-mono font-medium text-slate-800">
                    <Hash size={16} className="text-slate-400" />
<<<<<<< HEAD
                    {ASSET.serialNumber}
=======
                    {asset.serialNumber || 'N/A'}
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Location</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <MapPin size={16} className="text-slate-400" />
<<<<<<< HEAD
                    {ASSET.location}
=======
                    {asset.location || 'N/A'}
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Condition</div>
<<<<<<< HEAD
                  <Badge variant={ASSET.condition === 'Good' ? 'success' : ASSET.condition === 'Fair' ? 'warning' : 'danger'}>
                    {ASSET.condition}
=======
                  <Badge variant={asset.condition === 'Good' ? 'success' : asset.condition === 'Fair' ? 'warning' : asset.condition === 'Poor' ? 'danger' : 'neutral'}>
                    {asset.condition || 'Unknown'}
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                  </Badge>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Allocation & Maintenance History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Allocation History">
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div>
<<<<<<< HEAD
                    <p className="text-sm font-bold text-slate-900">Sarah Jenkins</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">Engineering Dept</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="info" className="mb-1.5">Current</Badge>
                    <p className="text-xs text-slate-500 font-medium">Jan 20, 2024 - Present</p>
                  </div>
                </div>
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">IT Storage Room</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">Inventory</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="neutral" className="mb-1.5">Returned</Badge>
                    <p className="text-xs text-slate-500 font-medium">Jan 15 - Jan 20, 2024</p>
=======
                    <p className="text-sm font-bold text-slate-900">{holderName}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">{departmentName}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="info" className="mb-1.5">Current</Badge>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Maintenance History">
              <div className="space-y-4">
<<<<<<< HEAD
                <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shrink-0">
                    <Wrench size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Initial Setup & Config</p>
                    <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">Installed corporate profile and security software.</p>
                    <p className="text-xs font-medium text-slate-400 mt-2">Jan 16, 2024 • by IT Support</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400 font-medium italic">No further maintenance records.</p>
=======
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400 font-medium italic">No maintenance records.</p>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Media & Documents */}
          <DashboardCard title="Files & Documents">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<<<<<<< HEAD
              <div className="flex items-center p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/50 transition-all cursor-pointer group bg-white">
                <div className="p-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">Purchase_Invoice.pdf</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">2.4 MB • Jan 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center p-3 border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-sm hover:bg-emerald-50/50 transition-all cursor-pointer group bg-white">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg mr-3 group-hover:bg-emerald-100 transition-colors">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">AppleCare_Warranty.pdf</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">1.1 MB • Jan 15, 2024</p>
                </div>
=======
              <div className="text-center py-4 col-span-2">
                  <p className="text-xs text-slate-400 font-medium italic">No documents available.</p>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
              </div>
            </div>
          </DashboardCard>

        </div>

        {/* Right Column - Status & Lifecycle */}
        <div className="space-y-6">
          
          {/* Status Card */}
          <DashboardCard title="Status & Booking">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Current Status</span>
<<<<<<< HEAD
                <AssetStatusBadge status={ASSET.status} />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-700">Available for Booking</span>
                <Badge variant={ASSET.isBookable ? 'success' : 'neutral'}>
                  {ASSET.isBookable ? 'Yes' : 'No'}
=======
                <AssetStatusBadge status={displayStatus} />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-700">Available for Booking</span>
                <Badge variant={asset.isSharedBookable ? 'success' : 'neutral'}>
                  {asset.isSharedBookable ? 'Yes' : 'No'}
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                </Badge>
              </div>
            </div>
          </DashboardCard>

          {/* Current Holder / Department */}
          <DashboardCard title="Assignment Information">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 border border-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
<<<<<<< HEAD
                  {ASSET.holder.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{ASSET.holder.name}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{ASSET.holder.role}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">{ASSET.holder.email}</p>
=======
                  {holderName !== 'Unassigned' ? holderName.split(' ').map(n => n[0]).join('') : '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{holderName}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{holderRole}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">{holderEmail}</p>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Department</p>
<<<<<<< HEAD
                  <p className="text-sm font-bold text-slate-900">{ASSET.department}</p>
=======
                  <p className="text-sm font-bold text-slate-900">{departmentName}</p>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Lifecycle & Financials */}
          <DashboardCard title="Lifecycle & Financials">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"><Calendar size={14} /></div>
                  Acquired On
                </div>
<<<<<<< HEAD
                <span className="text-sm font-bold text-slate-900">{ASSET.acquisitionDate}</span>
=======
                <span className="text-sm font-bold text-slate-900">{asset.acquisitionDate ? new Date(asset.acquisitionDate).toLocaleDateString() : 'N/A'}</span>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"><DollarSign size={14} /></div>
                  Purchase Cost
                </div>
<<<<<<< HEAD
                <span className="text-sm font-bold text-slate-900">${ASSET.acquisitionCost.toFixed(2)}</span>
=======
                <span className="text-sm font-bold text-slate-900">{asset.acquisitionCost ? `$${asset.acquisitionCost.toFixed(2)}` : 'N/A'}</span>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600"><Activity size={14} /></div>
                  Current Value
                </div>
<<<<<<< HEAD
                <span className="text-sm font-bold text-emerald-600">${ASSET.lifecycle.currentValue.toFixed(2)}</span>
=======
                <span className="text-sm font-bold text-emerald-600">N/A</span>
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
              </div>
            </div>
          </DashboardCard>

          {/* Activity Timeline */}
          <DashboardCard title="Activity Timeline">
            <div className="pt-2 pl-2">
              <ActivityCard 
<<<<<<< HEAD
                title="Allocated to Sarah Jenkins"
                description="Asset transferred from IT Storage to Engineering."
                timestamp="Jan 20"
                icon={CheckCircle2}
                iconColor="emerald"
              />
              <ActivityCard 
                title="Maintenance Done"
                description="Initial software provisioning completed."
                timestamp="Jan 16"
                icon={Wrench}
                iconColor="blue"
              />
              <ActivityCard 
                title="Asset Registered"
                description="Added to directory manually."
                timestamp="Jan 15"
=======
                title="Asset Registered"
                description="Added to directory manually."
                timestamp={new Date(asset.createdAt).toLocaleDateString()}
>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
                icon={Box}
                iconColor="purple"
              />
            </div>
          </DashboardCard>
          
        </div>
      </div>

      {/* Edit Modal (Mock) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col text-center space-y-4">
              <h3 className="font-bold text-slate-900 text-xl">Edit Asset</h3>
              <p className="text-sm text-slate-500">Edit form would be rendered here, similar to the Register modal.</p>
              <div className="flex gap-2 w-full pt-4">
                <Button className="flex-1" onClick={() => setIsEditModalOpen(false)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-2">
                <Trash2 size={32} />
              </div>
              <h3 className="font-bold text-slate-900 text-xl">Delete Asset</h3>
<<<<<<< HEAD
              <p className="text-sm text-slate-500">Are you sure you want to delete <span className="font-semibold text-slate-700">{ASSET.name}</span>? This action cannot be undone.</p>
=======
              <p className="text-sm text-slate-500">Are you sure you want to delete <span className="font-semibold text-slate-700">{asset.name}</span>? This action cannot be undone.</p>

>>>>>>> 25c276ded4546bec26ea8afd0ced4c7846393dc1
              <div className="flex gap-2 w-full pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="danger" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Confirm Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetailsPage;

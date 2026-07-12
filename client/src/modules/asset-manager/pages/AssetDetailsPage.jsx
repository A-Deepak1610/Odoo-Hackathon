import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Image as ImageIcon, FileText, 
  MapPin, Tag, Box, Hash, Calendar, DollarSign, Activity,
  User, Building2, Wrench, ArrowRightLeft, Clock, CheckCircle2
} from 'lucide-react';
import { DashboardCard, ActivityCard } from '../components';
import { AssetStatusBadge } from '../components/assets';

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

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Link to="/assets" className="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm bg-white">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{ASSET.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{ASSET.tag}</span>
              <AssetStatusBadge status={ASSET.status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors focus:outline-none shadow-sm">
            <Edit size={16} />
            <span>Edit Asset</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors focus:outline-none shadow-sm">
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
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
                  <div className="text-sm font-semibold text-slate-800">{ASSET.name}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Box size={16} className="text-blue-500" />
                    {ASSET.category}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Serial Number</div>
                  <div className="flex items-center gap-2 text-sm font-mono font-medium text-slate-800">
                    <Hash size={16} className="text-slate-400" />
                    {ASSET.serialNumber}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Location</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <MapPin size={16} className="text-slate-400" />
                    {ASSET.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Condition</div>
                  <div className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-100">{ASSET.condition}</div>
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
                    <p className="text-sm font-bold text-slate-800">Sarah Jenkins</p>
                    <p className="text-xs text-slate-500 mt-1">Engineering Dept</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100 inline-block mb-1">Current</span>
                    <p className="text-xs text-slate-400 font-medium">Jan 20, 2024 - Present</p>
                  </div>
                </div>
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">IT Storage Room</p>
                    <p className="text-xs text-slate-500 mt-1">Inventory</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded border border-slate-200 inline-block mb-1">Returned</span>
                    <p className="text-xs text-slate-400 font-medium">Jan 15 - Jan 20, 2024</p>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Maintenance History">
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 shrink-0">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Initial Setup & Config</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Installed corporate profile and security software.</p>
                    <p className="text-xs font-medium text-slate-400 mt-2">Jan 16, 2024 • by IT Support</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400 font-medium italic">No further maintenance records.</p>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Media & Documents */}
          <DashboardCard title="Files & Documents">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/20 transition-all cursor-pointer group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">Purchase_Invoice.pdf</p>
                  <p className="text-xs text-slate-500 mt-0.5">2.4 MB • Jan 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/20 transition-all cursor-pointer group">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg mr-3 group-hover:bg-emerald-100 group-hover:scale-105 transition-all">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">AppleCare_Warranty.pdf</p>
                  <p className="text-xs text-slate-500 mt-0.5">1.1 MB • Jan 15, 2024</p>
                </div>
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
                <span className="text-sm font-bold text-slate-600">Current Status</span>
                <AssetStatusBadge status={ASSET.status} />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-600">Available for Booking</span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${ASSET.isBookable ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {ASSET.isBookable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Current Holder / Department */}
          <DashboardCard title="Assignment Information">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 border border-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  {ASSET.holder.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{ASSET.holder.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{ASSET.holder.role}</p>
                  <p className="text-xs font-medium text-blue-600 mt-0.5">{ASSET.holder.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Department</p>
                  <p className="text-sm font-bold text-slate-800">{ASSET.department}</p>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Lifecycle & Financials */}
          <DashboardCard title="Lifecycle & Financials">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="p-1.5 bg-slate-50 rounded text-slate-400"><Calendar size={14} /></div>
                  Acquired On
                </div>
                <span className="text-sm font-bold text-slate-800">{ASSET.acquisitionDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="p-1.5 bg-slate-50 rounded text-slate-400"><DollarSign size={14} /></div>
                  Purchase Cost
                </div>
                <span className="text-sm font-bold text-slate-800">${ASSET.acquisitionCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <div className="p-1.5 bg-emerald-50 rounded text-emerald-500"><Activity size={14} /></div>
                  Current Value
                </div>
                <span className="text-sm font-bold text-emerald-600">${ASSET.lifecycle.currentValue.toFixed(2)}</span>
              </div>
            </div>
          </DashboardCard>

          {/* Activity Timeline */}
          <DashboardCard title="Activity Timeline">
            <div className="pt-2 pl-2">
              <ActivityCard 
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
                icon={Box}
                iconColor="purple"
              />
            </div>
          </DashboardCard>
          
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsPage;

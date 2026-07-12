import React, { useEffect } from 'react';
import { X, UploadCloud, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerAssetSchema } from '../../schemas/assetSchema';

export const RegisterAssetModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(registerAssetSchema),
    defaultValues: {
      isBookable: false,
    }
  });

  // Generate a placeholder tag when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue('tag', 'AST-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
    }
  }, [isOpen, setValue]);

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    // TODO: Implement API submission
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Register New Asset</h2>
            <p className="text-sm text-slate-500">Add a new asset to the organization directory.</p>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <form id="register-asset-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name *</label>
                  <input 
                    {...register('name')}
                    type="text" 
                    placeholder="e.g. MacBook Pro 16'' M3 Max" 
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Asset Tag *</label>
                  <input 
                    {...register('tag')}
                    type="text" 
                    readOnly
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-500 font-mono focus:outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Auto-generated identifier</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select 
                    {...register('category')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.category ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Software">Software</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
                  <input 
                    {...register('serialNumber')}
                    type="text" 
                    placeholder="Enter serial number" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Acquisition & Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Date *</label>
                  <input 
                    {...register('acquisitionDate')}
                    type="date" 
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.acquisitionDate ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                  />
                  {errors.acquisitionDate && <p className="text-red-500 text-xs mt-1">{errors.acquisitionDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Cost (USD) *</label>
                  <input 
                    {...register('acquisitionCost')}
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.acquisitionCost ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                  />
                  {errors.acquisitionCost && <p className="text-red-500 text-xs mt-1">{errors.acquisitionCost.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Condition *</label>
                  <select 
                    {...register('condition')}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.condition ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                  {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                  <input 
                    {...register('location')}
                    type="text" 
                    placeholder="e.g. IT Storage Room"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.location ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        {...register('isBookable')}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Available for Booking</p>
                      <p className="text-xs text-slate-500">Allow employees to request or book this asset</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Media & Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Asset Photo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" {...register('photo')} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Supporting Documents</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload documents</span>
                          <input type="file" className="sr-only" {...register('document')} accept=".pdf,.doc,.docx" />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">Invoices, warranties (PDF up to 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg flex items-start gap-2 border border-red-200">
                <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">Please correct the errors in the form before submitting.</p>
              </div>
            )}
            
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={handleClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="register-asset-form"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
          >
            Register Asset
          </button>
        </div>
      </div>
    </div>
  );
};

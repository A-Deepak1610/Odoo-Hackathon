import React, { useEffect, useState } from 'react';
import { X, UploadCloud, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerAssetSchema } from '../../schemas/assetSchema';
import { Input, Select, Label, Button } from '../ui';
import { createAssetApi, getAssetCategoriesApi } from '../../api';

export const RegisterAssetModal = ({ isOpen, onClose, onAssetCreated }) => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
      
      // Fetch categories
      getAssetCategoriesApi().then(res => {
        if (res.success) {
          setCategories(res.data);
        }
      }).catch(err => console.error("Failed to load categories", err));
    }
  }, [isOpen, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await createAssetApi({
        name: data.name,
        serialNumber: data.serialNumber,
        categoryId: data.category,
        acquisitionDate: data.acquisitionDate,
        acquisitionCost: data.acquisitionCost,
        condition: data.condition,
        location: data.location,
        isSharedBookable: data.isBookable
      });

      if (res.success) {
        reset();
        onClose();
        if (onAssetCreated) onAssetCreated();
      } else {
        setSubmitError(res.message || 'Failed to create asset');
      }
    } catch (err) {
      setSubmitError('An error occurred while creating the asset.');
    } finally {
      setIsSubmitting(false);
    }
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
            <h2 className="text-lg font-bold text-slate-900">Register New Asset</h2>
            <p className="text-sm font-medium text-slate-500">Add a new asset to the organization directory.</p>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <form id="register-asset-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5">
                  <Label>Asset Name *</Label>
                  <Input 
                    {...register('name')}
                    type="text" 
                    placeholder="e.g. MacBook Pro 16'' M3 Max" 
                    className={errors.name ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Asset Tag *</Label>
                  <Input 
                    {...register('tag')}
                    type="text" 
                    readOnly
                    className="bg-slate-100 text-slate-500 font-mono"
                  />
                  <p className="text-xs font-medium text-slate-400">Auto-generated identifier</p>
                </div>

                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select 
                    {...register('category')}
                    className={errors.category ? 'border-red-300 focus:ring-red-500' : ''}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Select>
                  {errors.category && <p className="text-red-500 text-xs font-medium">{errors.category.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Serial Number</Label>
                  <Input 
                    {...register('serialNumber')}
                    type="text" 
                    placeholder="Enter serial number" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Acquisition & Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label>Acquisition Date *</Label>
                  <Input 
                    {...register('acquisitionDate')}
                    type="date" 
                    className={errors.acquisitionDate ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.acquisitionDate && <p className="text-red-500 text-xs font-medium">{errors.acquisitionDate.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Acquisition Cost (USD) *</Label>
                  <Input 
                    {...register('acquisitionCost')}
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className={errors.acquisitionCost ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.acquisitionCost && <p className="text-red-500 text-xs font-medium">{errors.acquisitionCost.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Condition *</Label>
                  <Select 
                    {...register('condition')}
                    className={errors.condition ? 'border-red-300 focus:ring-red-500' : ''}
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </Select>
                  {errors.condition && <p className="text-red-500 text-xs font-medium">{errors.condition.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Location *</Label>
                  <Input 
                    {...register('location')}
                    type="text" 
                    placeholder="e.g. IT Storage Room"
                    className={errors.location ? 'border-red-300 focus:ring-red-500' : ''}
                  />
                  {errors.location && <p className="text-red-500 text-xs font-medium">{errors.location.message}</p>}
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center gap-4 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        {...register('isBookable')}
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-[20px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Available for Booking</p>
                      <p className="text-xs font-medium text-slate-500">Allow employees to request or book this asset</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Media & Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label>Asset Photo</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <div className="flex text-sm font-medium text-slate-600 justify-center">
                        <label className="relative cursor-pointer bg-transparent rounded-md text-blue-600 hover:text-blue-700 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" {...register('photo')} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs font-medium text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Supporting Documents</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <div className="flex text-sm font-medium text-slate-600 justify-center">
                        <label className="relative cursor-pointer bg-transparent rounded-md text-blue-600 hover:text-blue-700 focus-within:outline-none">
                          <span>Upload documents</span>
                          <input type="file" className="sr-only" {...register('document')} accept=".pdf,.doc,.docx" />
                        </label>
                      </div>
                      <p className="text-xs font-medium text-slate-500">Invoices, warranties (PDF up to 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3 border border-red-200">
                <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">Validation Error</h4>
                  <p className="text-sm font-medium text-red-700 mt-0.5">Please correct the errors in the form before submitting.</p>
                </div>
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3 border border-red-200">
                <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">Submission Failed</h4>
                  <p className="text-sm font-medium text-red-700 mt-0.5">{submitError}</p>
                </div>
              </div>
            )}
            
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-5 bg-slate-50 flex justify-end gap-3 shrink-0">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="register-asset-form" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Asset'}
          </Button>
        </div>
      </div>
    </div>
  );
};

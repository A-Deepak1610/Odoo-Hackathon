import React from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';
import { Input, Select, Button, Card, CardContent } from '../ui';

export const AssetFilters = () => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Left side: Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search assets by name or tag..." 
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Select className="w-auto">
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="vehicles">Vehicles</option>
            </Select>
            
            <Select className="w-auto">
              <option value="">All Departments</option>
              <option value="it">IT</option>
              <option value="hr">HR</option>
              <option value="engineering">Engineering</option>
            </Select>
            
            <Select className="w-auto">
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="maintenance">Maintenance</option>
            </Select>
            
            <Button variant="secondary" size="icon">
              <Filter size={16} />
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

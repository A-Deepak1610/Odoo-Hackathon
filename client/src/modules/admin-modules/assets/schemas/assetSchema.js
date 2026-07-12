import { z } from 'zod';

// Placeholder schema for asset validation
export const assetSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['active', 'maintenance', 'retired']).default('active'),
  assignedTo: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;

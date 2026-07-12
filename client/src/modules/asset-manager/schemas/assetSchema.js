import { z } from 'zod';

export const registerAssetSchema = z.object({
  name: z.string().min(2, "Asset name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  tag: z.string().min(1, "Asset tag is required"),
  serialNumber: z.string().optional(),
  acquisitionDate: z.string().min(1, "Acquisition date is required"),
  acquisitionCost: z.string().min(1, "Acquisition cost is required"),
  condition: z.string().min(1, "Please select condition"),
  location: z.string().min(1, "Location is required"),
  isBookable: z.boolean().default(false),
  photo: z.any().optional(),
  document: z.any().optional()
});

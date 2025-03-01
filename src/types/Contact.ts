import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      'Invalid phone number format'
    ),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  avatar: z.string().optional()
});

export type ContactInput = z.infer<typeof contactSchema>;

export interface Contact extends ContactInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ContactsResponse {
  contacts: Contact[];
  pagination: PaginationData;
}

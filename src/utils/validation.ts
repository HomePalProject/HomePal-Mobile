import { z } from 'zod';
import { Gender } from '@/src/types/api';

/**
 * Standard username validation schema.
 * Allows alphanumeric characters, underscores, dots, and hyphens.
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    'Username can only contain letters, numbers, dots, underscores, and hyphens'
  );

/**
 * Standard RFC email validation schema.
 */
export const emailSchema = z
  .string()
  .min(1, 'Email address is required')
  .email('Please enter a valid email address');

/**
 * Standard password validation schema matching ASP.NET Core Identity defaults.
 * Requires min 8 chars, 1 uppercase, 1 lowercase, 1 digit, and 1 special character.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.\[\]{}()?"!@#%&/\\,><':;|_~`]).{8,}$/,
    'Password must include uppercase, lowercase, number, and special character'
  );

/**
 * Sign In Form schema.
 */
export const loginFormSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Register Account Form schema (Step 0 before onboarding wizard).
 */
export const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .refine((val) => (val.match(/\p{L}/gu) || []).length >= 2, {
        message: 'Full name must contain at least 2 alphabetical letters',
      }),
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z
      .boolean()
      .refine((val) => val === true, { message: 'You must agree to the Terms and Conditions' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Onboarding Step 1 schema — Personal Profile (Gender & Birth Date).
 */
export const onboardingStep1Schema = z.object({
  gender: z.nativeEnum(Gender, {
    message: 'Please select your gender',
  }),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date format (YYYY-MM-DD)')
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        return !isNaN(date.getTime()) && age >= 13 && age <= 120;
      },
      { message: 'You must be at least 13 years old to use HomePal' }
    ),
});

/**
 * Onboarding Step 2 schema — Location & Region.
 */
export const onboardingStep2Schema = z.object({
  governorate: z
    .string()
    .min(2, 'Please select or enter a valid governorate name (at least 2 letters)')
    .regex(/^[\p{L}\s.-]+$/u, 'Governorate can only contain letters and spaces')
    .refine((val) => (val.match(/\p{L}/gu) || []).length >= 2, {
      message: 'Governorate name must contain at least 2 alphabetical letters',
    }),
  city: z
    .string()
    .min(2, 'Please enter your city or district (at least 2 letters)')
    .regex(/^[\p{L}0-9\s.,-]+$/u, 'City can only contain letters, numbers, and spaces')
    .refine((val) => (val.match(/\p{L}/gu) || []).length >= 2, {
      message:
        'City or district name must contain at least 2 alphabetical letters (e.g., Nasr City, Maadi)',
    }),
});

/**
 * Onboarding Step 3 schema — Household Setup.
 */
export const onboardingStep3Schema = z.object({
  memberCount: z
    .number()
    .int()
    .min(1, 'Household must have at least 1 member')
    .max(20, 'Household size cannot exceed 20 members'),
  monthlyBudget: z
    .string()
    .min(1, 'Please select or enter your monthly grocery budget')
    .refine(
      (val) => {
        const trimmed = val.trim();
        if (trimmed === 'EGP' || trimmed === '') return false;
        // Accept predefined budget range chips immediately
        if (
          trimmed.includes('–') ||
          trimmed.includes('-') ||
          trimmed.includes('Under') ||
          trimmed.includes('+')
        ) {
          return true;
        }
        // For exact custom amounts, validate numeric bounds
        const cleanNum = trimmed.replace(/[^0-9]/g, '');
        if (!cleanNum) return false;
        const num = parseInt(cleanNum, 10);
        return !isNaN(num) && num >= 500 && num <= 200000;
      },
      { message: 'Budget must be between 500 and 200,000 EGP per month' }
    ),
});

/**
 * Onboarding Step 4 schema — Dietary Preferences & AI Personalization.
 */
export const onboardingStep4Schema = z.object({
  lifestyles: z
    .array(z.string())
    .min(1, 'Please select at least one dietary lifestyle (e.g., Halal)'),
  allergies: z.array(z.string()),
  aiNote: z.string().max(500, 'AI notes cannot exceed 500 characters').optional(),
});

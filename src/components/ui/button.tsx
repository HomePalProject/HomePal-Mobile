import { TextClassContext } from '@/src/components/ui/text';
import { cn } from '@/src/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-full',
    Platform.select({
      web: "whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: 'bg-brand-primary active:opacity-85',
        destructive: 'bg-status-error active:opacity-85',
        outline:
          'border border-surface-border bg-surface-surface active:bg-surface-surface-variant',
        secondary: 'bg-surface-surface-variant active:opacity-85',
        ghost: 'bg-transparent active:bg-surface-surface-variant',
        link: 'bg-transparent active:opacity-75',
      },
      size: {
        default: cn('h-14 px-6 py-3 sm:h-12', Platform.select({ web: 'has-[>svg]:px-4' })),
        sm: cn(
          'h-10 gap-1.5 rounded-full px-4 sm:h-9',
          Platform.select({ web: 'has-[>svg]:px-3' })
        ),
        lg: cn('h-16 rounded-full px-8 sm:h-14', Platform.select({ web: 'has-[>svg]:px-6' })),
        icon: 'h-12 w-12 rounded-full sm:h-10 sm:w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'font-cairo text-[16px] font-bold',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-white',
        destructive: 'text-white',
        outline: 'text-text-primary',
        secondary: 'text-text-primary',
        ghost: 'text-text-primary',
        link: 'text-brand-primary underline',
      },
      size: {
        default: 'text-[16px]',
        sm: 'text-[14px]',
        lg: 'text-[18px]',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size }), className)}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };

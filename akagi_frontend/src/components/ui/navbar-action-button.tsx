import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface NavbarActionButtonProps extends ComponentProps<typeof Button> {
  icon: LucideIcon;
  iconClassName?: string;
  badge?: boolean;
}

export const NavbarActionButton = ({
  icon: Icon,
  className,
  iconClassName,
  badge,
  ref,
  ...props
}: NavbarActionButtonProps) => {
  return (
    <Button
      ref={ref}
      variant='ghost'
      size='icon'
      className={cn(
        'no-drag relative aspect-square text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
        className,
      )}
      {...props}
    >
      <Icon className={cn('h-4 w-4', iconClassName)} />
      {badge && (
        <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50' />
      )}
    </Button>
  );
};

NavbarActionButton.displayName = 'NavbarActionButton';

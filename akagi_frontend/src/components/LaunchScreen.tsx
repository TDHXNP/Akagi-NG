import { cn } from '@/lib/utils';

export function LaunchScreen({
  className,
  isStatic = false,
}: {
  className?: string;
  isStatic?: boolean;
}) {
  return (
    <div
      className={cn('flex min-h-screen flex-col items-center justify-center gap-8 p-8', className)}
    >
      {/* Logo Container with Glow Effect */}
      <div className='relative'>
        <div className='logo-glow-effect' />
        <img
          src='torii.svg'
          alt='Akagi Logo'
          className={cn(
            'relative h-24 w-24 drop-shadow-lg lg:h-32 lg:w-32',
            !isStatic && 'animate-in fade-in zoom-in-50 slide-in-from-bottom-4 duration-1000',
          )}
        />
      </div>

      {/* Text Content */}
      <div className='flex flex-col items-center gap-3'>
        <h1
          className={cn(
            'text-3xl font-bold tracking-tight lg:text-4xl',
            !isStatic &&
              'animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards delay-100 duration-1000',
          )}
        >
          Akagi <span className='text-rose-500'>NG</span>
        </h1>
        <p
          className={cn(
            'text-muted-foreground text-sm font-medium tracking-wide uppercase',
            !isStatic &&
              'animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards delay-200 duration-1000',
          )}
        >
          Next Generation Mahjong AI
        </p>
      </div>
    </div>
  );
}

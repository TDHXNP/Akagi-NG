import { Github, Scale } from 'lucide-react';
import { type FC, memo } from 'react';

import { AKAGI_VERSION } from '@/version';

export const Footer: FC = memo(() => {
  return (
    <footer className='py-1 text-center'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400'>
          <span className='font-semibold tracking-wide'>Akagi-NG</span>
          <span className='opacity-40'>v{AKAGI_VERSION}</span>
          <div className='h-3 w-px bg-zinc-300 dark:bg-zinc-700' />
          <a
            href='https://github.com/Xe-Persistent/Akagi-NG'
            onClick={(e) => {
              e.preventDefault();
              window.electron.invoke('open-external', 'https://github.com/Xe-Persistent/Akagi-NG');
            }}
            className='flex items-center gap-1.5 opacity-60 transition-opacity hover:opacity-100'
          >
            <Github className='h-3.5 w-3.5' />
            <span>GitHub</span>
          </a>
          <a
            href='https://github.com/Xe-Persistent/Akagi-NG/blob/master/LICENSE'
            onClick={(e) => {
              e.preventDefault();
              window.electron.invoke(
                'open-external',
                'https://github.com/Xe-Persistent/Akagi-NG/blob/master/LICENSE',
              );
            }}
            className='flex items-center gap-1.5 opacity-60 transition-opacity hover:opacity-100'
          >
            <Scale className='h-3.5 w-3.5' />
            <span>License</span>
          </a>
          <div className='h-3 w-px bg-zinc-300 dark:bg-zinc-700' />
          <span className='text-[0.625rem] opacity-30'>
            © {new Date().getFullYear()} Akagi-NG contributors.
          </span>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

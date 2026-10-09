'use client';

import { X } from 'lucide-react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';

export function SiteToaster() {
  return (
    <Toaster
      position='bottom-right'
      containerStyle={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}
      toastOptions={{
        duration: 6_000,
        className: 'font-body',
        style: {
          background: 'var(--color-ink)',
          color: 'var(--color-paper)',
          border: '1px solid color-mix(in srgb, var(--color-paper) 20%, transparent)',
          borderLeft: '4px solid var(--color-aqua)',
          borderRadius: 0,
          padding: '16px',
          maxWidth: 'min(384px, calc(100vw - 32px))',
          fontSize: 'var(--text-caption)',
          lineHeight: 'var(--leading-copy)',
          boxShadow: '0 16px 40px color-mix(in srgb, var(--color-ink) 20%, transparent)',
        },
        iconTheme: {
          primary: 'var(--color-aqua)',
          secondary: 'var(--color-ink)',
        },
        error: {
          duration: 8_000,
          style: { borderLeft: '4px solid var(--color-red-400)' },
          iconTheme: {
            primary: 'var(--color-red-300)',
            secondary: 'var(--color-ink)',
          },
        },
      }}
    >
      {(notification) => (
        <ToastBar toast={notification} position='bottom-right'>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {notification.type !== 'loading' && (
                <button
                  type='button'
                  aria-label='Cerrar notificación'
                  className='grid size-8 shrink-0 cursor-pointer place-items-center text-muted-on-dark transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua'
                  onClick={() => toast.dismiss(notification.id)}
                >
                  <X aria-hidden='true' className='size-4' />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

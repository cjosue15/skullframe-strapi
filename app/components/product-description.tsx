'use client';

import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';

export function ProductDescription({ content }: { content: BlocksContent }) {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        list: ({ children, format }) =>
          format === 'ordered' ? (
            <ol className='list-decimal space-y-2 pl-5 text-base leading-copy text-muted marker:font-semibold marker:text-blue'>
              {children}
            </ol>
          ) : (
            <ul className='list-disc space-y-2 pl-5 text-base leading-copy text-muted marker:text-blue'>{children}</ul>
          ),
        'list-item': ({ children }) => <li className='pl-1'>{children}</li>,
      }}
    />
  );
}

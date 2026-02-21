'use client';

import SideNav from './SideNav';
import { Button } from '@/components/retroui';
import { AlignJustify, X } from 'lucide-react';
import { useState } from 'react';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <div>
      <Button size="sm" variant="outline" className="p-2" onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? <X className="h-4 w-4" /> : <AlignJustify className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          className="bg-foreground/50 absolute top-0 right-0 left-0 h-screen w-full"
          onClick={close}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') close();
          }}
        />
      )}

      {isOpen && (
        <div className="absolute top-0 bottom-0 left-0 z-10 h-screen">
          <SideNav setIsOpen={setIsOpen} />
        </div>
      )}
    </div>
  );
}

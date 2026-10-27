'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import Sidebar from './Sidebar';

export default function HeaderImage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-full w-full">
      <Image
        src="/domino_banner.jpg"
        alt="header"
        loading="eager"
        fill
        className="hidden object-fill md:block"
      />
      <Image
        src="/domino_banner_mobile.jpg"
        alt="header"
        loading="eager"
        fill
        className="block object-fill md:hidden"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Abrir menú"
            className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-md bg-black/40 text-white md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-4/5 p-0">
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <div className="p-4 h-full">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

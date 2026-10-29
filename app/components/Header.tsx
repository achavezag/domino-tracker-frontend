'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import Sidebar from './Sidebar';

export default function HeaderImage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-full w-full">
      {/* DESKTOP */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/domino_banner.jpg"
          alt="header"
          loading="eager"
          fill
          sizes="100vw"
          className="object-fill dark:hidden"
        />
        <Image
          src="/domino_banner_dark.jpg"
          alt="header"
          loading="eager"
          fill
          sizes="100vw"
          className="hidden object-fill dark:block"
        />
      </div>

      {/* MOBILE */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src="/domino_banner_mobile.jpg"
          alt="header"
          loading="eager"
          fill
          sizes="100vw"
          className="object-fill dark:hidden"
        />
        <Image
          src="/domino_banner_mobile_dark.jpg"
          alt="header"
          loading="eager"
          fill
          sizes="100vw"
          className="hidden object-fill dark:block"
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Abrir menú"
            className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-md bg-background text-foreground border border-foreground/80 shadow-md md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-4/5 p-0">
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <SheetDescription className="sr-only">
            Menú de navegación principal
          </SheetDescription>
          <div className="p-4 h-full">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

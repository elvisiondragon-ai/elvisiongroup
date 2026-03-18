"use client";

import React, { Suspense } from "react";
import ResellerLanding from '@/views/tools_pages/reseller';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ResellerLanding />
    </Suspense>
  );
}

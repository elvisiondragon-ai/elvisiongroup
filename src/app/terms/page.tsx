"use client";

import React, { Suspense } from "react";
import { Terms } from '@/views/Terms';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <Terms />
    </Suspense>
  );
}

"use client";
import { Suspense } from "react";

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

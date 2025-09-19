"use client";

import React from 'react';

export default function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-6">{children}</div>;
}

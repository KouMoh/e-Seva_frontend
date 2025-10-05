"use client";
import React from 'react';
import FocusTracer from './FocusTracer';

export default function DevFocusWrapper() {
  // Only render in development builds
  if (process.env.NODE_ENV !== 'development') return null;
  return <FocusTracer />;
}

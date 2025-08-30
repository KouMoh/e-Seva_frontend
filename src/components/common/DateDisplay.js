"use client";
export default function DateDisplay({ value, format }) {
  if (!value) return <>—</>;
  const date = typeof value === 'string' ? new Date(value) : value;
  // Default: show date and time in user's locale
  return <span suppressHydrationWarning>{date.toLocaleString()}</span>;
}

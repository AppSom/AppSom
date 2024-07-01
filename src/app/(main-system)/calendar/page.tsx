'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';

const Calendar = dynamic(() => import('@/components/Calendar/Calendar'), {
  ssr: false,
});

export default function CalendarPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="h-full bg-somon">
      <Calendar />
    </main>
  );
}

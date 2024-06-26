'use client';

import Calendar from '@/components/Calendar/Calendar';
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function CalendarPage() {

  const[loading,setLoading] = useState(false);
    useEffect(()=>{
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
        },1500)
    },[]);

    if(loading){
      return(
          <Loading/>
      )
    }

  return (
    <main className="h-full bg-somon">
      <Calendar/>
    </main>
  );
}

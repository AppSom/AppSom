'use client'

import BoardList from "@/components/Board/BoardList"
import { ThemeProvider } from "@/components/ControlSystem/themeSet"
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function StarredPage () {

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
        <ThemeProvider>
        <main className="min-h-screen bg-somon ml-64">
            <BoardList starred={true}></BoardList>
        </main>
        </ThemeProvider>
    )
}
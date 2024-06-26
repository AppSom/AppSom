'use client'
import BoardList from "@/components/Board/BoardList"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

export default function BoardPage () {

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
        <div className="min-h-screen bg-somon ml-64">
            <BoardList starred={false}></BoardList>
            <ToastContainer />
        </div>
    )
}
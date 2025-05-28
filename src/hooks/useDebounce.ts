"use client"
import { useEffect, useState } from "react";


export default function useDebounce({text , duration} : {text : string , duration : number}){
    const [newText,setNewText] = useState<string>();

    useEffect(()=>{
        
       let timer = setTimeout(() => {
            setNewText(text);
        }, duration);

        return ()=> clearTimeout(timer);
    },[text,duration]);

    return newText;
}

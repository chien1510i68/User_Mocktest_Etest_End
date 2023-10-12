import React, { useEffect, useState } from 'react';
import { getAllExam } from '../api/exam';
import { useNavigate, useParams } from 'react-router-dom';


function MockTest() {
    const [data , setData] = useState(null)
    const navigate = useNavigate()
    const handleGetData = () =>{
        getAllExam().then((res)=>{
             console.log("DATA:" ,res.data);
             setData(res.data)
        })
    }
useEffect(()=>{
    handleGetData();
},[])
    return (
        <div>
                <h2>this is the text</h2>
                {
                    data && data.map((item)=>(
                        <h2 onClick={()=>{navigate(`/exam/${item.id}`)}}>{item.name}</h2>
                    ))
                }
            
        </div>
    );
}

export default MockTest;
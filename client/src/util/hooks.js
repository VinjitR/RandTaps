import { useState } from "react";

export const useForm =(calback, initialState = {}) =>{
    const [values,setValues] = useState(initialState);
      
    const onChange =(e) =>{
        setValues({...values, [e.target.name]:e.target.value});
      }
    
    const onSubmit = (e)=>{
        e.preventDefault();
        calback();
      }
    
    return {
        onChange,
        onSubmit,
        values
    };
}
import React,{useContext} from 'react';
import{Navigate, Outlet} from 'react-router-dom';

import {AuthContext} from '../context/auth';

export default function AuthRoute() {

    const {user} = useContext(AuthContext);

    return(user ? <Navigate to="/" replace/>: <Outlet/>)
}
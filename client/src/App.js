import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container fluid >
        <MenuBar/>
        <Routes>
          <Route path="/" element={ <Home/> }/>
          <Route element={<AuthRoute/>}>
            <Route path='login' element={ <Login/> }/>
            <Route path='register' element={ <Register/> }/>
          </Route>
        </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;

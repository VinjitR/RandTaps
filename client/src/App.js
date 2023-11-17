import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';

function App() {
  return (
    <Router>
      <Container fluid >
      <MenuBar/>
      <Routes>
      <Route path="/" element={ <Home/> }/>
      <Route path='login' element={ <Login/> }/>
      <Route path='register' element={ <Register/> }/>
      </Routes>
      </Container>
    </Router>
  );
}

export default App;

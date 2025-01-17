import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {  Menu  } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

function MenuBar() {

    const {user, logout} = useContext(AuthContext);

    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' :pathname.substring(1);
    const [activeItem,setActiveItem] = useState(path);

    const handleItemClick = (e, { name }) => setActiveItem(name);

    const menuBar  = user ? (
      <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item
        name={user.username}
        active
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position='right'>
      <Menu.Item
          name='logout'
          onClick={logout}
        />
      </Menu.Menu>
    </Menu>
    ):
    (      <Menu pointing secondary size='massive' color='teal'>
    <Menu.Item
      name='Home'
      active={activeItem === 'home'}
      onClick={handleItemClick}
      as={Link}
      to="/"
    />

    <Menu.Menu position='right'>
    <Menu.Item
      name='Register'
      active={activeItem === 'register'}
      onClick={handleItemClick}
      as={Link}
      to="/register"
    />
    <Menu.Item
        name='login'
        active={activeItem === 'login'}
        onClick={handleItemClick}
        as={Link}
        to="/login"
      />
    </Menu.Menu>
  </Menu>)


    return menuBar;
    
    }

export default MenuBar;
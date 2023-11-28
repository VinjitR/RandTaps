import React, { useState, useContext } from 'react';
import {Button, Form, Message} from 'semantic-ui-react';
import {useMutation, gql} from '@apollo/client';
import {useNavigate} from 'react-router-dom';

import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

export default function Login() {
const context = useContext(AuthContext);
const [errors,setErrors] = useState({});
const navigate= useNavigate();

const {onChange, onSubmit, values} = useForm(loginUserCallback, {
  username:'',
  password:''

})

const [loginUser, {loading}] = useMutation(LOGIN_USER, {
  variables:values,
  onCompleted: (data)=>{
    context.login(data.login);
    navigate('/');
  },
  onError: ({graphQLErrors}) =>{
    if (graphQLErrors){
    console.log(graphQLErrors[0].extensions.errors);
    setErrors(graphQLErrors[0].extensions.errors);
    }
  }
});

function loginUserCallback(){
  loginUser();
}

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading? 'loading':''}>
        <h1> Login</h1>
        <Form.Input
          label='Username'
          placeholder='Username..'
          name='username'
          type='text'
          value={values.username}
          error={errors.username ? true: false}
          onChange={onChange}/>
        <Form.Input
          label='Password'
          placeholder='Password..'
          name='password'
          type='password'
          value={values.password}
          error={errors.password ? true: false}
          onChange={onChange}/>
          <Button type='submit' primary>Login</Button>

      </Form>
      { Object.keys(errors).length > 0 && (
            <div className='ui error message'>
              <ul className='list'>
                {
                  Object.values(errors).map(value =>(
                    <li className='item' key={value}>{value}</li>
                  ))
                }
                </ul> 
            </div>
      )
      }

    </div>
  )
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username
        password: $password
    ){
      id
      email
      username
      createdAt
      token
    }
  }
`

import React, { useContext, useState } from 'react';
import {Button, Form} from 'semantic-ui-react';
import {useMutation, gql} from '@apollo/client';
import {useNavigate} from 'react-router-dom';

import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

export default function Register() {
const context = useContext(AuthContext);
const [errors,setErrors] = useState({});
const navigate= useNavigate();

const {onChange, onSubmit, values} = useForm(registerUser, {
  username:'',
  email:'',
  password:'',
  confirmPassword:''
})

const [addUser, { loading}] = useMutation(REGiSTER_USER, {
  variables:values,
  onCompleted: (data)=>{
    context.login(data.register)
    navigate('/');
  },
  onError: ({graphQLErrors}) =>{
    if (graphQLErrors){
    console.log(graphQLErrors[0].extensions.errors);
    setErrors(graphQLErrors[0].extensions.errors);
    }
  }
});

function registerUser() {
  addUser();
}


  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading? 'loading':''}>
        <h1> Register</h1>
        <Form.Input
          label='Username'
          placeholder='Username..'
          name='username'
          type='text'
          value={values.username}
          error={errors.username ? true: false}
          onChange={onChange}/>
        <Form.Input
          label='Email'
          placeholder='Email..'
          name='email'
          type='email'
          value={values.email}
          error={errors.email ? true: false}
          onChange={onChange}/>
        <Form.Input
          label='Password'
          placeholder='Password..'
          name='password'
          type='password'
          value={values.password}
          error={errors.password ? true: false}
          onChange={onChange}/>
        <Form.Input
          label='Confirm Password'
          placeholder='Confirm Password..'
          name='confirmPassword'
          type='password'
          value={values.confirmPassword}
          error={errors.confirmPassword ? true: false}
          onChange={onChange}/>
          <Button type='submit' primary>Register</Button>

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

const REGiSTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword     
      }
    ){
      id
      email
      username
      createdAt
      token
    }
  }
`

import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import {gql,useMutation} from'@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

export default function PostForm() {

    const [error, setError] = useState({});
    const {values, onChange, onSubmit} = useForm(createPostCallback,{
        body:''
    })



    const [createPost, {loading}] = useMutation(CREATE_POST_MUTATION, {
        variables:values,
        onCompleted: (data)=>{
            values.body = '';
        },
        refetchQueries: [FETCH_POSTS_QUERY],
        onError: ({graphQLErrors}) =>{
            if (graphQLErrors){
            setError(graphQLErrors[0]);
            }
          }
      })
    
      function createPostCallback() {
        createPost();
      }
    

  return (
    <div>
        <Form onSubmit={onSubmit}>
            <h2>Create a Post:</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Write anything!!!"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={Object.keys(error).length > 0? true: false}>

                </Form.Input>
                <Button type='submit' color='teal'>
                    Post it
                </Button>
            </Form.Field>
        </Form>
        {Object.keys(error).length > 0 && (
            <div className='ui error message' style={{marginBottom :'20px'}}>
                <ul className='list'>
                    <li>{error.message}</li>
                </ul>
            </div>
        )}
    </div>
  )
}

const CREATE_POST_MUTATION= gql`
mutation createPost($body: String!){
    createPost(body: $body){
        id
        body
        createdAt
        username
        likeCount
        likes{
        username
        }
        commentCount
        comments{
        id
        username
        body
        createdAt
        }
    }
}
`

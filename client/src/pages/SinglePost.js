import React, { useContext, useRef, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { Button, Card, Grid, Image, Form, Input } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { useNavigate, useParams } from 'react-router-dom';
import CommentButton from '../components/CommentButton';

function SinglePost() {
  const {postId} = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment,setComment] = useState('');

  const {
    data, loading
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION,{
    variables:{
      postId,
      body: comment
    },
    onCompleted: () =>{
      setComment('');
      commentInputRef.current.blur();
    },
    onError: ({graphQLErrors}) =>{
      if (graphQLErrors){
      console.log(graphQLErrors[0]);
      }
    },
    refetchQueries: FETCH_POST_QUERY,
  })

  function deletePostCallback() {
    navigate('/');
  }

  let postMarkup;
  if (loading) {
    postMarkup = <h2>Loading post..</h2>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <CommentButton commentCount={commentCount}/>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {
              user && (
                <Card fluid>
                  <Card.Content>
                  <Card.Header>Post a Comment</Card.Header>
                  <Form>
                    <Input fluid
                    type='text'
                    placeholder='Comment..'
                    name="comment"
                    value={comment}
                    onChange={(e)=>{setComment(e.target.value)}}
                    ref={commentInputRef}>
                    </Input>
                    <Button
                    type='submit'
                    color='teal'
                    disabled={comment.trim()=== ''}
                    onClick={submitComment}>
                      Comment
                    </Button>
                  </Form>
                  </Card.Content>
                </Card>
              )
            }
            {comments.map(comment =>(
                <Card fluid key={comment.id}>
                    <Card.Content>
                        {user && user.username === comment.username &&(
                            <DeleteButton postId={id} commentId={comment.id}/>
                        )}
                        <Card.Header>{comment.username}</Card.Header>
                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                        <Card.Description>{comment.body}</Card.Description>
                    </Card.Content>
                </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!){
    createComment(postId: $postId, body: $body){
      id
      username
      body
      createdAt
      comments{
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
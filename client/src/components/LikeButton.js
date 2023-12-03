import React,{useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useMutation , gql } from '@apollo/client';
import { Button,Icon,Label, Popup } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphql';


export default function LikeButton({user,post: {id, likes, likeCount}}) {


    const [liked,setLiked] = useState(false);

    useEffect(()=>{
        if(user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        }else {setLiked(false);}
    },[user,likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION,{
        variables: {postId: id},
        refetchQueries: FETCH_POSTS_QUERY
    })

    const likeButton = user? (
        liked ? (
        <Button color='teal'>
            <Icon name='heart' />
        </Button>
        ):
        (            
        <Button color='teal' basic>
            <Icon name='heart' />
        </Button>
        )):
        (
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
        )

  return (
    <Popup inverted content={liked?"UnLike Post":"Like Post"} trigger={
        <Button as='div' labelPosition='right' onClick={likePost}>
            {likeButton}
            <Label as='a' basic color='teal' pointing='left'>
            {likeCount}
            </Label>
        </Button>
    } />
  )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId:ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`

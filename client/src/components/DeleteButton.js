import React, { useState } from 'react';
import {gql, useMutation} from '@apollo/client';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import {FETCH_POSTS_QUERY} from '../util/graphql';

export default function DeleteButton({postId,callback}) {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST_MUTATION,{
        update(proxy){
            setConfirmOpen(false);

            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
              });
              data.getPosts = data.getPosts.filter((p) => p.id !== postId);
              proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: data });

            if(callback){
                callback();
            }
        },
        variables:
        {
            postId
        },
        refetchQueries: FETCH_POSTS_QUERY,
    })
    return(
        <>
        <Button as="div" color='red'  floated='right' onClick={()=> setConfirmOpen(true)}>
            <Icon name='trash' style= {{margin:0}}/>
        </Button>
        <Confirm
            open={confirmOpen}
            onCancel={()=> setConfirmOpen(false)}
            onConfirm={deletePost}/>
        </>
    );
}

const DELETE_POST_MUTATION = gql`
mutation deletePost($postId:ID!){
    deletePost(postId: $postId)
}`;

const DELETE_COMMENT_MUTATION = gql`
mutation deleteComment($postId:ID!, $commentId:ID!){
    deleteComment(postId: $postId, commentId: $commentId){
        id
        comments{
            id
            body
            username
            createdAt
        }
        commentCount
    }
}`;


import React, { useState } from 'react';
import {gql, useMutation} from '@apollo/client';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import {FETCH_POSTS_QUERY} from '../util/graphql';

export default function DeleteButton({postId,commentId,callback}) {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION: DELETE_POST_MUTATION;

    const [deletePostorComment] = useMutation(mutation,{
        update(proxy){
            setConfirmOpen(false);

            if(!commentId)
            {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                if (data.getPosts){
                    let newData = data.getPosts.filter((p) => p.id !== postId);
                    proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
                }
            }


            if(callback){
                callback();
            }
        },
        variables:
        {
            postId,
            commentId,
        }
    })
    return(
        <>
        <Button as="div" color='red'  floated='right' onClick={()=> setConfirmOpen(true)}>
            <Icon name='trash' style= {{margin:0}}/>
        </Button>
        <Confirm
            open={confirmOpen}
            onCancel={()=> setConfirmOpen(false)}
            onConfirm={deletePostorComment}/>
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


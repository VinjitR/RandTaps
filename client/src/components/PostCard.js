import React,{ useContext }from 'react';
import { Card, Image} from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import CommentButton from './CommentButton';

export default function PostCard( {post:{body, createdAt, id, username, likeCount, commentCount, likes}, callBack} ) {
    const {user} = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
      <LikeButton user={user} post={{id, likes, likeCount}}/>
      <CommentButton postId={id} commentCount={commentCount}/>
      {user && user.username === username && (
        <DeleteButton postId ={id} callback={callBack}/>
      )}
      </Card.Content>
    </Card>
  )
}

import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Label, Icon, Popup } from 'semantic-ui-react';

export default function CommentButton({postId, commentCount}) {

    const MyCommentButton = (postId ? (
        <Popup content="Comment on Post" inverted trigger={    
            <Button labelPosition='right' as={Link} to={`/posts/${postId}`}>
            <Button color='blue' basic>
              <Icon name='comments' />
            </Button>
            <Label as='div' basic color='blue' pointing='left'>
             {commentCount}
            </Label>
          </Button>
            }
            />
    ):(
        <Popup content="Comment on Post" inverted trigger={    
            <Button labelPosition='right' as="div">
            <Button color='blue' basic>
              <Icon name='comments' />
            </Button>
            <Label basic color='blue' pointing='left'>
             {commentCount}
            </Label>
          </Button>
            }
            />
    ));
  return (
    <>
    {MyCommentButton}
    </>
  )
}

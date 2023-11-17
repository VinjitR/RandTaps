import React from 'react';
import {useQuery,gql} from '@apollo/client';
import {Grid ,Image} from 'semantic-ui-react';

import PostCard from '../components/PostCard';

function Home() {

  const {loading, error, data} = useQuery(FETCH_POSTS_QUERY);
  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>
            Recent Posts
        </h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1> Loading Posts</h1>
        ) : (
          data.getPosts && data.getPosts.map( post => (
            <Grid.Column key = {post.id} style={{ marginBottom : '20px'}}>
              <PostCard post = {post}/>
            </Grid.Column>
          )) 
        )}
      </Grid.Row>
    </Grid>
  )
}

const FETCH_POSTS_QUERY = gql`
query getPosts{
  getPosts{
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
`;

export default Home;
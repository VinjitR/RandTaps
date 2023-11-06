import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink} from '@apollo/client';

const httpLink = new createHttpLink ({
    uri:"http://localhost:5000",
})

const client =  new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

export default function ApolloClientProvider() {
  return (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
  )
}

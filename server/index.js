const { ApolloServer} = require('apollo-server');
const {PubSub} = require('graphql-subscriptions');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const { MONGODB } = require('./config.js');
const typeDefs = require('./graphql/typeDefs.js');
const resolvers =  require('./graphql/resolvers');

const pubsub= new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({ req }) => ({ req , pubsub })
});

mongoose.connect(MONGODB, {useNewUrlParser: true})
    .then(()=>{
        console.log("MongoDB connected")
        return server.listen({ port: 5000})
    })
    .then(res =>{
        console.log(`Server running at ${res.url}`)
    })
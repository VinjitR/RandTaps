const { ApolloServer} = require('apollo-server');
const {PubSub} = require('graphql-subscriptions');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const { MONGODB } = require('./config.js');
const typeDefs = require('./graphql/typeDefs.js');
const resolvers =  require('./graphql/resolvers');

const pubsub= new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({ req }) => ({ req , pubsub })
});

mongoose.connect(MONGODB, {useNewUrlParser: true})
    .then(()=>{
        console.log("MongoDB connected")
        return server.listen({ port: PORT})
    })
    .then(res =>{
        console.log(`Server running at ${res.url}`)
    })
    .catch(err =>{
        console.error(err);
    })
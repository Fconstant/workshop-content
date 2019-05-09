import { ApolloServer } from 'apollo-server-express';
import basicAuth from 'basic-auth';
import express from 'express';
import morgan from 'morgan';
import { AuthAPI } from './data/AuthDataSource';
import { EventAPI } from './data/EventDataSource';
import RESOLVERS from './resolvers';
import TYPE_DEFS from './types';

const PORT = 5555

const app = express()

const authApi = new AuthAPI()
const eventsApi = new EventAPI()


const apolloServer = new ApolloServer({
    dataSources: () => {
        return {
           eventsApi,
           authApi
        }
    },
    typeDefs: TYPE_DEFS,
    resolvers: RESOLVERS,
    context: ({ req }) => {
        const { name, pass } = basicAuth(req) || {}
        console.log(`name: ${name}, pass: ${pass}`)
        if (name && pass) {
            return authApi.auth({
                username: name,
                password: pass
            }).then(() => {
                return { authenticated: true }
            }).catch((e) => {
                console.error(e)
                return { authenticated: false }
            })
        }
        return { authenticated: false }
    },
    playground: true
})

app.use(morgan('dev'))
apolloServer.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: PORT }, () => {
    console.log(`Listening to ${PORT}`)
})
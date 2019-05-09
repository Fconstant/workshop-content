import { AuthenticationError } from 'apollo-server-core';
import { ValidationError, ApolloError } from 'apollo-server-errors';
import { GraphQLDateTime } from 'graphql-iso-date';
import { PostSubmissionModel } from '../model/postSubmissionModel';
import { omit } from 'lodash'

export default {
    DateTime: GraphQLDateTime,
    EventData: {
        __resolveType(eventData) {
            if (eventData.materials) {
                return 'EventSubmission';
            }

            if (eventData.when) {
                return 'Event';
            }

            return null;
        },
    },
    Query: {
        getEvents: (_, { filter: input }, { dataSources }) => {
            return dataSources.eventsApi.events().then(_events => {
                if (_events) {
                    let events = [..._events]
                    if (input && input.byTitle) {
                        events = events.filter(e => e.title.toLowerCase().includes(input.byTitle.toLowerCase()))
                    }
                    if (input && input.byThread) {
                        events = events.filter(e => e.threads.includes(input.byThread))
                    }
                    return events
                }
                return null
            })
        },
        getSubmissions: (_, { filter: input }, { dataSources, authenticated }) => {
            if (!authenticated) {
                throw new AuthenticationError("Not authenticated!")
            }
            return dataSources.eventsApi.submissions().then(_subs => {
                if (_subs) {
                    let subs = [ ..._subs ]
                    if (input && input.byTitle) {
                        subs = subs.filter(e => e.title.toLowerCase().includes(input.byTitle.toLowerCase()))
                    }
                    if (input && input.byThread) {
                        subs = subs.filter(e => e.threads.includes(input.byThread))
                    }
                    return subs
                }
                return null
            })
        } 
    },
    Mutation: {
        postEventSubmission: async (_, args, { dataSources }) => {
            const isValid = await PostSubmissionModel.isValid(args.input)
            if (!isValid) {
                throw ValidationError()
            }
            return dataSources.eventsApi.putSubmissions(args.input)
        },
        createEvent: async (_, args, { authenticated, dataSources }) => {
            if (!authenticated) {
                throw new AuthenticationError("Not authenticated!")
            }

            const { submissionId, when } = args
            const foundSub = await dataSources.eventsApi.submissionById(submissionId)
            if (foundSub) {
                return dataSources.eventsApi.putEvent({
                    ...omit(foundSub, ['subject', 'materials', 'id']),
                    when
                }).then(event => {
                    console.log(event)
                    return event
                })
            } else {
                throw new ApolloError("Submission not found!")
            }
        },
    }
}
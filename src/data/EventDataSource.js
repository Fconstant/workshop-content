import { RESTDataSource } from 'apollo-datasource-rest';
import { omit } from 'lodash'

export class EventAPI extends RESTDataSource {

    constructor() {
        super()
        this.baseURL = "http://localhost:5501/"
    }

    events() {
        return this.get('/events')
    }

    eventById(id) {
        return this.get('/events/' + id)
    }

    putEvent(eventData) {
        return this.post('/events', eventData)
    }

    submissions() {
        return this.get('/submissions')
            .then((r) => r.map(e => {
                return {
                    ...omit(e, 'event_title'),
                    title: e.event_title
                }
            }))
    }

    submissionById(id) {
        return this.get('/submissions/' + id).then((e) => {
            return {
                ...omit(e, 'event_title'),
                title: e.event_title
            }
        })
    }

    putSubmissions(submissionData) {
        return this.post('/submissions', {
            ...omit(submissionData, 'title'),
            event_title: submissionData.title,
        })
    }

}
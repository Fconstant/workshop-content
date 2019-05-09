import jsonServer from 'json-server'
import path from 'path'
import morgan from 'morgan'

const middleware = jsonServer.defaults()

const events = jsonServer.router(path.join('data_sources', 'events_db.json'))
const eventsServer = jsonServer.create()

eventsServer.use(events)
eventsServer.use(middleware)
eventsServer.use(morgan('[EVENTS] :method :url :status :res[content-length] - :response-time ms'))

eventsServer.listen(5501, () => {
    console.log("Event server running!")
})
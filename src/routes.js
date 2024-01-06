import { Database } from './database.js'
import {randomUUID} from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handle: (req, res) => {
            const {search} = req.query
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null )
        
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handle: (req, res) => {
        
            const {title, description } = req.body
         
            const tasks = {
                id: randomUUID(),
                title, 
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            const status = database.insert('tasks', tasks)
        
            return res.writeHead(status).end()
        }
    }, 
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handle: (req, res) => {
            const {id} = req.params
            
            const status = database.delete('tasks', id)

            return res.writeHead(status).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handle: (req, res) => {
            const {id} = req.params
            const {title, description} = req.body
            
            const status =  database.update('tasks', id, {title, description})

            return res.writeHead(status).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handle: (req, res) => {
            const { complete } = req.query
            const {id} = req.params
            const status = database.complete('tasks', id, complete)
            
            return res.writeHead(status).end()
        }
    }
]
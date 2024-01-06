import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf8').then(data => {this.#database = JSON.parse(data)}).catch(()=> this.#persist())
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search){ 
        let data = this.#database[table] ?? []
        if (search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value])=> {   
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            } )
        }
        return data
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }else{
            this.#database[table] = [data]
        }

        this.#persist()

        return 201
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if (rowIndex !== -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
            return 202
        }else{
            return 404
        }
        
    }
   
    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        const {title, description} = data
        
        if (rowIndex !== -1){
            if(title){
                this.#database[table][rowIndex].title = title
                this.#database[table][rowIndex].updated_at = new Date()
                this.#persist()
            }
            if(description){
                this.#database[table][rowIndex].description = description
                this.#database[table][rowIndex].updated_at = new Date()
                this.#persist()
            }
            return 204
        }else{
            return 404
        }
    }

    complete(table, id, complete){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        console.log(complete)
        console.log(rowIndex )

        if (rowIndex !== -1){
            if(complete === "true"){
                console.log('aqui no if')
                this.#database[table][rowIndex].completed_at = new Date()
                return 204
            }
            if(complete === "false"){
                this.#database[table][rowIndex].completed_at = null
                return 204
            }
        }

        return 404
           
        
    }
}
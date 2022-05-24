import SwaggerClient from 'swagger-client'

const client = new SwaggerClient({
    url: "http://localhost:8081/swagger/doc.json"
})

export default client;
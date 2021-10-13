const { ApolloServer } = require('apollo-server');
const JWT = require('jsonwebtoken')
require('dotenv').config()
const { resolvers } = require('./GraphQL/resolvers')
const { typeDefs } = require('./GraphQL/typeDefs')
const { basedatos } = require('./database/config.db');

//  Conexion a la base de datos
basedatos();


//  Crear Servidor ->
const server = new ApolloServer({
    cors,
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers['token'] || '';
        if( token ){
            try {

                const usuario = JWT.verify( token, process.env.SECRETORPRIVATEKEY );
                return usuario;
                
            } catch (error) {
                console.log( error );
                console.log('token no valido / vencido ');
            }
        };
    }
});

//  Arrancar Servidor ->
server.listen({port: process.env.PORT || 4000 }).then(( {url} ) =>{
    console.log('Servidor Corriendo en la URL', url );
});
const JWT = require('jsonwebtoken')


const CrearToken = ( usuario, secret, expiresIn ) => {
    
    const { id } = usuario;

    return JWT.sign( { id }, secret, { expiresIn })
}


module.exports = {
    CrearToken
}
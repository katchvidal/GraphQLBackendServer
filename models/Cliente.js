const { Schema, model, Mongoose } = require('mongoose')

const ClienteSchema = Schema({
    nombre : {
        type : String,
        required : true,
        trim : true
    },
    apellido : {
        type : String,
        required : true,
        trim : true
    },
    empresa: {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    telefono : {
        type : String,
        trim : true
    },

    estado: {
        type : Boolean,
        default: true
    },

    creado : {
        type: Date,
        default : Date.now()
    },
    vendedor: {
        type : Schema.Types.ObjectId,
        required: true,
        ref : 'Usuario'
    }
})


module.exports = model('Cliente', ClienteSchema )
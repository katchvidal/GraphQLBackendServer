const {Schema, model} = require('mongoose')

const ProductoSchema = Schema({

    nombre : {

        type : String,
        required : true,
        trim : true,

    },

    precio : {

        type : String,
        required : true,
        trim : true,
    },

    existencia : {

        type : Number,
        required : true,
        trim : true,

    },

    estado : {

        type: Boolean,
        default : true
        
    },

    creado : {

        type : Date,
        default : Date.now()
        
    }
})

module.exports = model( 'Producto', ProductoSchema )
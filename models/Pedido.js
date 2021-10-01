const { Schema, model } = require('mongoose')



const PedidoSchema = Schema({

    pedido : {
        type : Array,
        required: true
    },
    total : {
        type : Number,
        required : true
    },
    cliente : {
        type : Schema.Types.ObjectId,
        ref : 'Cliente',
        required : true
    },
    vendedor : {
        type : Schema.Types.ObjectId,
        ref : 'Usuario',
        required : true 
    },
    estado : {

        type : String,
        default : "Pendiente"

    },
    creado : {
        type : Date,
        default : Date.now()
    }
})



module.exports = model( 'Pedido', PedidoSchema )
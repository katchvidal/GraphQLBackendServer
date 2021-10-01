require('dotenv').config()
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const Producto = require('../models/Producto')
const Cliente = require('../models/Cliente')
const { CrearToken } = require('../Helpers/Token')
const Pedido = require('../models/Pedido')
const chalk = require('chalk')


const resolvers = {

    Query : {

        obtenerUsuario : async(_, {}, token ) => {
            const { id } = token
            try {

                const usuario = await Usuario.findById ( id )
                return usuario;
                
            } catch (error) {

                console.log( error );

            }
        },
        
        obtenerProducto: async(_, { id } ) => {

            try {
                
                const producto = await Producto.findById ( id );
                return producto;

            } catch (error) {

                console.log( error );

            }
        },

        obtenerProductos: async(_, {}, ctx ) => {

            try {
                
                const productos = await Producto.find({ estado : true })
                return productos;

            } catch (error) {

                console.log( error );

            }
        },

        obtenerCliente: async(_, { id }, token ) => {

            try {
                
                const cliente = await Cliente.findById( id )
                if( cliente.vendedor.toString() !== token.id.toString() ){
                    throw new Error(' No tienes las Credenciales Necesarias ')
                }

                return cliente;

            } catch (error) {

                console.log( error );

            }
        },

        obtenerClientes: async( _, {}, token ) => {
            const { id } = token
            try {

                const clientes = await Cliente.find({ estado : true, vendedor : id })
                return clientes;

            } catch (error) {
                console.log( error );
            }
        },

        obtenerPedidos: async() => {
            
            try {

                const pedidos = await Pedido.find({})
                return pedidos

            } catch (error) {
                console.log( chalk.redBright( error ));
            }

        },

        obtenerPedido: async( _, { id }, token ) => {
            try {
                const pedido = await Pedido.findById( id )
                if ( pedido.vendedor.toString() !== token.id.toString()){
                    throw new Error( chalk.redBright(' No tienes las Credenciales Necesarias '))
                };

                return pedido;
            } catch (error) {
                console.log( chalk.redBright( error) );
            }
        }

    },

    Mutation: {

        nuevoUsuario: async(_, { input } ) => {

            //  Validacion si el usuario ya esta registrado
            const { email, password } = input 
            let usuario = await Usuario.findOne({ email })
            if( usuario ){
                throw new Error( `Email: ${ email } Ya esta Registrado` )
            };
            //  Hashear Password
            const salt = await bcrypt.genSalt(15);
            //  Le caemos encima al input.password -> Hasheado 
            input.password = await bcrypt.hash(password, salt)

            try {

                const usuario = new Usuario( input )
                usuario.save();
                return usuario;

            } catch (error) {

                console.log(error);

            }

        },

        autenticarUsuario: async(_, { input }) => {
            
            //  Verificar si el Usuario Ya existe
            const { email, password } = input
            const usuario = await Usuario.findOne({ email })

            if(!usuario){

                throw new Error( ` Usuario No Esta Registrado ` )
            }

            //  Revisar si el password es correcto 
            const CONTRASEÑAVALIDA = await bcrypt.compare(password, usuario.password )

            if ( !CONTRASEÑAVALIDA ){

                throw new Error(' Password o Usuario No son Validos -> Password  ')

            }
            const token = CrearToken( usuario, process.env.SECRETORPRIVATEKEY, '8h' )

            return {
                token
            }
            
        },

        nuevoProducto: async(_, { input } ) => {
            const { nombre } = input
            let producto = await Producto.findOne( { nombre } )
            if ( producto ) {
                throw new Error ( `El Producto: ${producto} Ya Existe ` )
            }
            try {
                const producto = await new Producto( input );
                producto.save();
                return producto;
            } catch (error) {
                console.log( error );
            }
        },

        editarProducto: async(_, { id, input } ) => {

            let producto = await Producto.findById( id )

            if( !producto ){
                throw new Error( `Producto: ${producto} No Existe ` )
            }

            try {

                producto = await Producto.findByIdAndUpdate( {_id :  id }, input, { new: true } );
                producto.save();
                return producto;

            } catch (error) {

                console.log( error );

            }
        },

        eliminarProducto: async(_ ,{ id } ) => {
            let producto = await Producto.findById ( id )
            if(!producto){
                throw new Error( ' El producto No Existe ')
            }

            try {
                
                producto = await Producto.findByIdAndUpdate({_id : id }, { estado : false })
                producto.save();

                return ' Producto Eliminado Correctamente  '

            } catch (error) {
                console.log( error );
            }
        },

        nuevoCliente: async(_, { input }, token ) => {
            const { id } = token
            const { email, nombre, apellido } = input
            let cliente = await Cliente.findOne({ email })
            if( cliente ){
                throw new Error( `Cliente ${ nombre } ${ apellido } Ya existe ` )
            }

            try {
                
                cliente = await new Cliente( input )
                cliente.vendedor = id
                cliente.save();
                return cliente;

            } catch (error) {

                console.log( error );

            }
        },

        editarCliente: async(_, { id,  input }, token  ) => {

            let cliente = await Cliente.findById( id );
            if ( !cliente ){
                throw new Error('Cliente No Existe')
            }

            if( cliente.vendedor.toString() !== token.id ){
                throw new Error ('No tienes las credenciales')
            }

            cliente = await Cliente.findOneAndUpdate( { _id : id } , input, { new : true });
            cliente.vendedor = token.id
            cliente.save();
            return cliente;

        },

        eliminarCliente: async(_, { id }, token ) => {
            let cliente = await Cliente.findById( id );
            if( !cliente ){
                throw new Error('Cliente No Existe')
            }

            if( cliente.vendedor.toString() !== token.id ){
                throw new Error(' No tienes las Credenciales Suficientes ')
            }

            cliente = await Cliente.findByIdAndUpdate( id, { estado : false } )
            cliente.vendedor = token.id
            cliente.save();

            return 'Cliente Eliminado Correctamente'
        },

        nuevoPedido: async(_, { input } , token ) => {
     
            const clienteExiste = await Cliente.findById( input.cliente )
            if( !clienteExiste ){
                throw new Error ( ' Cliente No Existe ')
            };

            if(clienteExiste.vendedor.toString() !== token.id ){
                throw new Error ( ' No tienes las Credenciales suficientes ')
            };

            //  Revisar que el stock este disponile *> Asynchrono
            for await ( const articulo of input.pedido ){
                const { id } = articulo;

                const producto = await Producto.findById( id )
                if( articulo.cantidad > producto.existencia ){
                    throw new Error(`El aritculo ${producto.nombre} excede la cantidad disponible `)
                } else {
                    //  Restar de la base de datos la cantidad de productos que vamos a tomar
                    producto.existencia = producto.existencia - articulo.cantidad
                    await producto.save()
                }
            }

            //  Guardar Pedido
            const pedido = await new Pedido( input )
            //  Asignarle como vendedor el usuario que esta registrando el pedido
            pedido.vendedor = token.id
            pedido.save();
            return pedido;
        },
        
        
    }



}

module.exports = {
    resolvers
}
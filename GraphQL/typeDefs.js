const { gql } = require('apollo-server')

//  En Los Type -> Se definen todos los campos que Van a poder devolver
//  En Los Input -> Se definen que campos son pedidos para que el usuario o frontend devuelva pueden ser requeridos o no !

const typeDefs = gql`

    type Usuario {

        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String

    }

    
    type Token {
        token : String
    }

    type Producto {

        id: ID
        nombre: String
        precio: Float
        existencia: Int
        creado: String

    }

    type Cliente {

        id: ID
        nombre : String
        apellido : String
        email: String
        empresa: String
        telefono: String
        vendedor : ID
        estado : String

    }

    type Pedido {

        id: ID
        pedido : [PedidoProducto]
        total : Float
        vendedor : ID
        cliente : ID
        estado : EstadoPedido

    }

    type PedidoProducto {

        id : ID
        cantidad : String
    }

    input UsuarioInput {
        
        nombre: String!
        apellido: String!
        email: String!
        password: String!

    }

    input AutenticarInput {

        email : String!
        password : String!

    }

    input ProductoInput {

        nombre: String!
        existencia: Int!
        precio: Float!

    }

    input ClienteInput {

        nombre : String!
        apellido : String!
        empresa : String!
        telefono: String
        email: String!

    }

    input PedidoInput {

        pedido : [PedidoProductoInput]!
        total : Float!
        cliente : ID!
        estado : EstadoPedido

    }

    input PedidoProductoInput {

        id: ID!
        cantidad: String!

    }

    enum EstadoPedido {

        ACTIVO
        PENDIENTE
        CANCELADO

    }

    type Query {
        
        #Usuarios
        obtenerUsuario: Usuario

        #Productos
        obtenerProducto( id: ID! ): Producto
        obtenerProductos: [Producto]

        #Clientes
        obtenerCliente( id : ID! ): Cliente
        obtenerClientes: [Cliente]

        #Pedidos
        obtenerPedidos: [Pedido]
        obtenerPedido( id : ID! ): Pedido
        
    }

    type Mutation {

        #Usuarios
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput) : Token

        #Productos
        nuevoProducto( input : ProductoInput ) : Producto
        editarProducto( id : ID!, input: ProductoInput ) : Producto
        eliminarProducto( id : ID! ) : String

        #Clientes
        nuevoCliente( input : ClienteInput ) : Cliente
        editarCliente( id : ID!, input : ClienteInput ) : Cliente
        eliminarCliente( id : ID! ) : String

        #Pedidos
        nuevoPedido( input : PedidoInput ) : Pedido

    }
`;


module.exports = {
    typeDefs
}
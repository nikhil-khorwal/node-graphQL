require('dotenv').config()
const express = require("express");
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');


const app = express()
const port = 3000

const authors = [
    {id:1,name:"sdasd"},
    {id:2,name:"dfsd"},
    {id:3,name:"dffgsd"},
    {id:4,name:"dsdsdsdsd"},
 
]

const books = [
    { id: 1, name: "sdsdsdasdsadad", authorId: 1 },
    {id:2 , name:"sdsdsdasdsadad", authorId:2},
    {id:3 , name:"sdsdsdasdsadad", authorId:1},
    {id:4 , name:"sdsdsdasdsadad", authorId:2},
    {id:5 , name:"sdsdsdasdsadad", authorId:3},
    {id:6 , name:"sdsdsdasdsadad", authorId:4}
]




const BookType = new GraphQLObjectType({
    name: "Book",
    description:"it shows list of books",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find((item) =>  item.id == book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "it shows list of authors",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter((item) => item.authorId === author.id )
            }
        }
    })
})  

const RootQueryType=new GraphQLObjectType({
    name: 'Query',
    description: "Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: 'single book',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent,args) => books.find((item)=>item.id == args.id) 
        },
        author: {
            type: AuthorType,
            description: 'single author',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent,args) => authors.find((item)=>item.id == args.id) 
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of author",
            resolve:()=>authors
        }
    })
})


const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: "add book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = {id:books.length+1,name:args.name,authorId:args.authorId}
                books.push(book)
                return book 
            }
        },
        addAuthor: {
            type: AuthorType,
            description: "add author",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const author = {id:authors.length+1,name:args.name}
                authors.push(author)
                return author 
            }
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})


app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}))

app.listen(port, () => {
    console.log(`App start at port http://localhost:${port}/graphql`);
})
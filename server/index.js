const { ApolloServer, gql, PubSub } = require('apollo-server');
const cors = require('cors');
const mongoose = require('mongoose')
const Message = require('./schema/Message')
const { v4: uuidv4 } = require('uuid');

const typeDefs = gql(`

  type Message {
      _id: ID!
      user: String!
      content: String!
  }

  input MessageInput {
      user: String!
      content: String!
  }

  type Query {
      messages: [Message!]
  }

  type Mutation {
      addMessage(messageInput: MessageInput): Message
      deleteAllMessages: String
  }

  type Subscription {
      messages: [Message]
  }

`)

const MESSAGES = 'MESSAGES'

const resolvers = {
  Subscription: {
    messages: {
      subscribe: async(_, __, { pubsub }) =>  {
        return pubsub.asyncIterator(MESSAGES)
      }
    }
  },

  Query: {
      messages: async() => {
        try {
          const messages = await Message.find()
          return messages;
        } catch(err) {
          throw err
        }
      }
  },

  Mutation: {
    addMessage: async(_, args, { pubsub }) => {

        const message = new Message({
          user: args.messageInput.user,
          content: args.messageInput.content
        })
        
        const savedMessage = await message.save()

        const messages = await Message.find()

        pubsub.publish(MESSAGES, { messages })

        return savedMessage
    },

    deleteAllMessages: async() => {
      await Message.deleteMany()
      const messages = await Message.find()

      pubsub.publish(MESSAGES, { messages })
      
      return 'deleted'
    }
  }

}

const pubsub = new PubSub() 

const server  = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
        pubsub
    })
})


mongoose
.connect(
  'mongodb+srv://jimmy:blink182@realtimemessagedb.0avy2.mongodb.net/realTimeMessageDB?retryWrites=true&w=majority', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() => {
  server.listen().then(({ url }) => console.log(`Server started at ${url}`));
})
.catch(err => console.log(err))

import React, { useEffect } from 'react'
import { useQuery, useSubscription, gql } from '@apollo/client';

const GET_MESSAGES = gql`
    query {
        messages {
            _id
            user
            content
        }
    }
  `

const MESSAGES = gql`
    subscription {
        messages {
            _id
            user
            content
        }
    }   
`



const Chat = ({ user }) => {
    const { data: initMessages, loading } = useQuery(GET_MESSAGES);
    const { data: newMessages } = useSubscription(MESSAGES);
   
    useEffect(() => {
        window.scrollTo({
            left: 0, 
            top: document.body.scrollHeight, 
            behavior: 'smooth' 
        });
    }, [initMessages, newMessages])

    if(loading) return <p>Loading...</p>

    const data = (newMessages, initMessages) => {
        let messages 
        if(newMessages) messages = newMessages
        else messages = initMessages
        return messages
    }


    let { messages } = data(newMessages, initMessages)

    const positionStyle = (user, message) => {
        if(user === message.user){
            return {
                justifyContent: 'flex-end'
            }
        } else {
            return {
                justifyContent: 'flex-start'
            }
        }
    }

    const avatarStyle = (user, message) => {
        if(user === message.user){
            return {
                order: 2
            }
        } else {
            return {
                order: 'initial'
            }
        }
    }

    const bubbleStyle = (user, message) => {
        if(user === message.user){
            return {
                background: '#47a2ff',
                color: 'black'
            }
        } else {
            return {
                background: '#00b572',
                color: 'white'
            }
        }
    }


    return (
        <div className="container chat"> 
            {messages.map((message, i) => {
                return (
                    <div 
                        key={i}
                        className="message" 
                        style={positionStyle(user, message)} 
                    >
                        <div 
                            className="avatar" 
                            style={avatarStyle(user, message)}
                        >
                                {message.user.split("")[0].toUpperCase()}
                        </div>
                        <div 
                            className="content"
                            style={{...bubbleStyle(user, message), padding: '1rem', borderRadius: 30 }}
                        >
                            <p className="message-content">
                                {message.content}
                            </p>
                        </div>
                    </div>
                )
            }
            )}
        </div>
    )
}

export default Chat

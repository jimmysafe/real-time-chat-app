import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client';

const ADD_MESSAGE = gql`
    mutation($user: String!, $content: String!) {
        addMessage(messageInput: { user: $user, content: $content}){
            _id
        }
    }
`

const Input = ({ user }) => {
    const [value, setValue] = useState("")
    const [addMessage, { data }] = useMutation(ADD_MESSAGE);
     
    const handleSubmit = (e) => {
        e.preventDefault()
        addMessage({ 
            variables: { user, content: value } 
        })
        setValue("")
    }


    return (
        <form onSubmit={handleSubmit} >
            <input
                type="text"
                placeholder="Write Here.."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button disabled={!value}>Send</button>
        </form>
    )
}

export default Input

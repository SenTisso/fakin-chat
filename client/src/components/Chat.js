import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = 'localhost:5000'

    useEffect(() => {
        const {name, room} = queryString.parse(location.search)

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {
            /* this is executed when "callback" is called */
        })

        /* poslouchej, jestli neprijde event 'message' */
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        })

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search])

    useEffect(() => {
        console.log("messages", messages);
    }, [messages])

    const sendMessage = e => {
        e.preventDefault();

        if (message) {
            console.log(`sending message: ${message}...`);
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    return (
        <div>
            <div style={{height: "200px", background: "grey"}}>
                <ScrollToBottom>
                    {messages.map(message => (
                        <p><span style={{fontWeight: "bold"}}>{message.user}:</span> {message.text}</p>
                    ))}
                </ScrollToBottom>
            </div>
            <input type="text" placeholder="message"
                   value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
            />
        </div>
    );
};

export default Chat;

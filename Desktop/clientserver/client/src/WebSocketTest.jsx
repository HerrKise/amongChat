import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

function WebSocketTest(props) {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('')
    const [text, setText] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef()
    const userId = useRef();



    const sendMessage = () => {
        const message = {
            username,
            userId: userId.current,
            id: Date.now(),
            message: text,
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setText('')
    }

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000/newMessage');

        socket.current.onopen = () => {
            setIsConnected(true);
            userId.current = Date.now();
            const message = {
                event: 'connection',
                username,
                id: userId.current
            }
            socket.current.send(JSON.stringify(message))
            console.log('Connection is provided')
        }

        socket.current.onmessage = (event) => {
            console.log(event.data)
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        }

        socket.current.onclose = () => {
            console.log('Socket closed')
        }

        socket.current.onerror = () => {
            console.log('Something is going wrong...')
        }
    }


    return (
        <div className='flex items-center'>
            <div>
                {isConnected ? (<div className='flex flex-row gap-[10px] outline outline-4 outline-green items-center rounded-[10px]'>
                    <input type='text' value={text} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage()
                        }
                    }} onChange={(e) => setText(e.target.value)} className='outline outline-1 outline-black bg-white ml-2 my-[15px] px-[10px] py-[5px]'/>
                    <button onClick={sendMessage} className='px-[15px] py-[10px] hover:bg-green-600 my-[15px] mr-[10px] rounded-[10px] outline outline-2 outline-black text-center'>Send</button>
                </div>) : (<div className='flex flex-row gap-[10px] outline outline-4 outline-green items-center'>
                    <input type='text' onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            connect()
                        }
                    }} placeholder='Enter your name' value={username} onChange={(e) => setUsername(e.target.value)} className='outline outline-1 outline-black bg-white ml-2 my-[15px] px-[10px] py-[5px]'/>
                    <button onClick={connect} className='px-[15px] py-[10px] hover:bg-green-600 my-[15px] mr-[10px] rounded-[10px] outline outline-2 outline-black text-center'>Enter</button>
                </div>)}

                <div className='relative flex flex-col mt-[30px] h-[500px] overflow-scroll outline outline-1 outline-black no-scrollbar rounded-[10px] bg-[url("../public/amongBg.webp")]'>
                    {messages.map(m => {
                        if (m.event === 'connection') {
                            return <div className='text-black self-center px-2 bg-white rounded-[5px] m-1 font-["Impostograph"] tracking-wider text-lg leading-[24px]' key={m.id}>{m.username} is connected</div>
                        } else if (m.event === 'message' && m.userId === userId.current) {
                            return <div className='text-black self-end flex flex-row px-2 bg-white rounded-[5px] m-1 font-["Impostograph"] tracking-wider text-lg leading-[24px]' key={m.id}>You: {m.message} <img src='../public/amongRed.svg' width='24' className='transform -scale-x-100'/> </div>
                        } else if (m.event === 'message' && m.userId !== userId.current)
                            return <div className='text-black self-start flex flex-row px-2 bg-white rounded-[5px] m-1 font-["Impostograph"] tracking-wider text-lg leading-[24px]' key={m.id}><img src='../public/amongRed.svg' width='24'/> {m.username}: {m.message}</div>
                        }
                    )}
                </div>
            </div>
        </div>
    );
}

export default WebSocketTest;
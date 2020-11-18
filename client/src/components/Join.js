import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className="join">
            <h1>Join</h1>

            <input type="text" placeholder="Name" required
                onChange={e => setName(e.target.value)}
                name="name"
            />
            <input type="text" placeholder="Room" required
                onChange={e => setRoom(e.target.value)}
                name="room"
            />
            <Link to={`/chat?name=${name}&room=${room}`}
                onClick={e => (!name || !room) ? e.preventDefault() : null}
            >
                <button type="submit">Sign In</button>
            </Link>
        </div>
    );
};

export default Join;

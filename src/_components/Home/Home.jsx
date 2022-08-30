import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from '../../_store'; 
import { authActions } from "../../_store";

const Home = () => {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector(x => x.auth);
    const { users } = useSelector(x => x.users); 
    useEffect(() => {
        dispatch(userActions.getAll()); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    const nuevoUser= { 
        id: 1,
        title: 'Miss',
        firstName: 'Vianey',
        lastName: 'Hernández',
        email: 'vianey@bloggs.com',
        role: 'User',
        password: 'Vianey123'
    }
    const update=()=> dispatch(authActions.updateUser(nuevoUser))
    
    return (
        <div>
            <h1>Hi {authUser?.firstName}!</h1>
            <p>Welcome</p>
            <h3>Users:</h3>
            {users.length &&
                <ul>
                    {users.map(user =>
                        <li key={user.id}>{user.firstName} {user.lastName}</li>
                    )}
                </ul>
            }
            {users.loading && <div className="spinner-border spinner-border-sm"></div>}
            {users.error && <div className="text-danger">Error loading users: {users.error.message}</div>}
            <button onClick={update}>Hola Actualiza</button>
        </div>
    );
} 

export default Home

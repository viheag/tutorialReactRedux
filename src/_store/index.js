import {
    configureStore,
    combineReducers
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import thunk from 'redux-thunk';
import {
    authReducer
} from './auth.slice';
import {
    usersReducer
} from './users.slice';

export * from './auth.slice';
export * from './users.slice';

const persistConfig = {
    key: 'root',
    storage,
}
const rootReducer = combineReducers({
    auth: authReducer,
    users: usersReducer
})

const aux = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: aux,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store)
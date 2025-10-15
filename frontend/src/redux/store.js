import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postSlice from './postSlice';
import chatSlice from './chatSlice';
import socketSlice from './socketSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rtnSlice from "./rtnSlice";


// 1. Combine your reducers first.
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  chat: chatSlice,
  socketio: socketSlice,
  realTimeNotification: rtnSlice
  // Add other slices here
});

// 2. Create the persist configuration.
//    - 'key' is the key for the root of your state in storage.
//    - 'storage' is the storage engine (e.g., localStorage).
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// 3. Create the persisted reducer.
//    This wraps your rootReducer with the persist configuration.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the store.
//    - The reducer is now the 'persistedReducer'.
//    - The middleware is configured here to ignore the non-serializable actions from redux-persist.
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Create the persistor.
//    The persistor is what actually saves and rehydrates your state.
export const persistor = persistStore(store);

// 6. Export the configured store.
export default store;

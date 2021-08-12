import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { app, persistor } from './app/store'
import { Provider } from 'react-redux';
import EditProfile from './components/Edit Profile/EditProfile';
import { PersistGate } from 'redux-persist/integration/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';


ReactDOM.render(
  
  <React.StrictMode>
    
    <Provider store={app}>
      <PersistGate loading="null" persistor = {persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

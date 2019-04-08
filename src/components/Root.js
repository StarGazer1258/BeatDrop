import React, { Component } from 'react'

import App from './App'
import { Provider } from 'react-redux'
import { store, persistor } from '../store'
import { PersistGate } from 'redux-persist/integration/react';

class Root extends Component {
    render() {
        return (
          <Provider store={ store }>
           <PersistGate loading={ <div>Loading...</div> } persistor={ persistor }>
            <App />
           </PersistGate>
          </Provider>
        )
    }
}

export default Root
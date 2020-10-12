import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'
// import App from './app_admin'
import * as serviceWorker from './service-worker'
import { createBrowserHistory } from 'history'
import { Router } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const history = createBrowserHistory()

ReactDOM.render(
    <Router history={history}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Router>,
    document.getElementById('root')
)

// If you want your app to issue offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

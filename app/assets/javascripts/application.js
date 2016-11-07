import 'jquery-helpers'
import 'jquery-ujs'

import 'babel-polyfill'
import 'bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import {Router, browserHistory} from 'react-router'
import routes from 'routes'

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
)

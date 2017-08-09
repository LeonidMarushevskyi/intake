import 'jquery-helpers'
import 'jquery-ujs'

import 'babel-polyfill'
import 'bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from 'store/configureStore'
import routes from 'routes'
import {Provider} from 'react-redux'

import Autocompleter from 'common/Autocompleter'

const store = configureStore()
if (document.getElementById('app')) {
  ReactDOM.render(
    <Provider store={store}>
    {routes}
    </Provider>,
    document.getElementById('app')
  )
}

if (document.getElementById('app-release-one')) {
  ReactDOM.render(
    <div>
      <label className='no-gap' htmlFor='people'>People</label>
      <Autocompleter id='people' />
    </div>,
    document.getElementById('app-release-one')
  )
}

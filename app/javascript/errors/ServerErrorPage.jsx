import React from 'react'

const ServerErrorPage = () => (
  <div className='error-panel centered'>
    <h4>
      <i className='fa fa-warning c-red gap-right'/>
      Sorry, something went wrong.
    </h4>
    <div className='gap-top'>
      <span>It&apos;s nothing you did. Due to an entirely internal error, your request could not be completed. Please try refreshing the page.</span>
    </div>
  </div>
)

export default ServerErrorPage

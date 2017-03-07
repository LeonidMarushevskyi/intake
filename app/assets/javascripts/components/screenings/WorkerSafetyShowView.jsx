import React from 'react'

export default class WorkerSafetyShowView extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <div className='card show double-gap-top' id='worker-safety-card'>
        <div className='card-header'>
          <span>Worker Safety</span>
        </div>
        <div className='card-body no-pad-top' />
      </div>
    )
  }
}

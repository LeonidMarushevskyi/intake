import React from 'react'

export default class CrossReportShowView extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <div className='card show double-gap-top' id='cross-report-card'>
        <div className='card-header'>
          <span>Cross Report</span>
        </div>
        <div className='card-body no-pad-top' />
      </div>
    )
  }
}

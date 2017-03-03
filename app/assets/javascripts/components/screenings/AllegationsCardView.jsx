import React from 'react'

export default class AllegationsCardView extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <div className='card edit double-gap-top' id='allegations-card'>
        <div className='card-header'>
          <span>Allegations</span>
        </div>
        <div className='card-body no-pad-top'>
          <div className='row'>
            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Alleged Victim/Children</th>
                    <th scope='col'>Alleged Perpetrator</th>
                    <th scope='col'>Allegation(s)</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

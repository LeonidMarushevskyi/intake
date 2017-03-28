import React from 'react'
import EditLink from 'components/common/EditLink'
import AllegationRow from 'components/screenings/AllegationRow'

const AllegationsShowView = ({allegations, onEdit}) => (
  <div className='card show double-gap-top' id='allegations-card'>
    <div className='card-header'>
      <span>Allegations</span>
      <EditLink
        ariaLabel='Edit allegations'
        onClick={(event) => {
          event.preventDefault()
          onEdit()
        }}
      />
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
            <tbody>
              {
                allegations.map((allegation) => (
                  <AllegationRow
                    victim={allegation.get('victim')}
                    perpetrator={allegation.get('perpetrator')}
                    displayVictim={true}
                  />
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)

AllegationsShowView.propTypes = {
  allegations: React.PropTypes.object.isRequired,
  onEdit: React.PropTypes.func.isRequired,
}

export default AllegationsShowView

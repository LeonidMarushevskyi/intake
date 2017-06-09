import PropTypes from 'prop-types'
import React from 'react'
import EditLink from 'components/common/EditLink'
import nameFormatter from 'utils/nameFormatter'

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
              {allegations.map((allegation) => {
                const sortedAllegationTypes = allegation.get('allegation_types').sort()
                return sortedAllegationTypes.map((allegationType, index) =>
                  <tr key={`allegation_type-${index}`}>
                    <td><strong>{nameFormatter(allegation.get('victim'))}</strong></td>
                    <td>{nameFormatter(allegation.get('perpetrator'))}</td>
                    <td>{allegationType}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)

AllegationsShowView.propTypes = {
  allegations: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
}

export default AllegationsShowView

import AlertErrorMessage from 'common/AlertErrorMessage'
import PropTypes from 'prop-types'
import React from 'react'
import nameFormatter from 'utils/nameFormatter'

const AllegationsShowView = ({allegations, alertErrorMessage, required}) => (
  <div className='card-body no-pad-top'>
    { alertErrorMessage && <AlertErrorMessage message={alertErrorMessage} /> }
    <div className='row'>
      <div className='table-responsive'>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'>Alleged Victim/Children</th>
              <th scope='col'>Alleged Perpetrator</th>
              <th scope='col'>Allegation(s){required && ' (Required)'}</th>
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
)

AllegationsShowView.propTypes = {
  alertErrorMessage: PropTypes.string,
  allegations: PropTypes.object.isRequired,
  required: PropTypes.bool.isRequired,
}

export default AllegationsShowView

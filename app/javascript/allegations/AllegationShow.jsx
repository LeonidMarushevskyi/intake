import AlertErrorMessage from 'common/AlertErrorMessage'
import EditLink from 'common/EditLink'
import React from 'react'
import PropTypes from 'prop-types'

const AllegationShow = ({allegations, alertErrorMessage, onEdit, required}) => (
  <div className='card show double-gap-top'>
    <div className='card-header'>
      <span>Allegations</span>
      {onEdit &&
        <EditLink
          ariaLabel={'Edit allegations'}
          onClick={(event) => {
            event.preventDefault()
            onEdit()
          }}
        />
      }
    </div>
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
              {allegations.map((allegation, index) => (
                <tr key={index}>
                  <td>{allegation.victim}</td>
                  <td>{allegation.perpetrator}</td>
                  <td>{allegation.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)

AllegationShow.propTypes = {
  alertErrorMessage: PropTypes.string,
  allegations: PropTypes.arrayOf(PropTypes.shape({
    perpetrator: PropTypes.string,
    type: PropTypes.string,
    victim: PropTypes.string,
  })),
  onEdit: PropTypes.func,
  required: PropTypes.bool,
}

AllegationShow.defaultProps = {
  allegations: [],
}

export default AllegationShow

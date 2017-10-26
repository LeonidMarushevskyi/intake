import React from 'react'
import PropTypes from 'prop-types'

const AllegationShow = ({allegations}) => (
  <div className='card show double-gap-top'>
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
  allegations: PropTypes.arrayOf(PropTypes.shape({
    perpetrator: PropTypes.string,
    type: PropTypes.string,
    victim: PropTypes.string,
  })),
}

AllegationShow.defaultProps = {
  allegations: [],
}

export default AllegationShow

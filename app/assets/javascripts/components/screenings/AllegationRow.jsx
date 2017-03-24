import React from 'react'
import nameFormatter from 'utils/nameFormatter'

const AllegationRow = ({victim, perpetrator, displayVictim}) => (
  <tr>
    <td><strong>{displayVictim ? nameFormatter(victim) : ''}</strong></td>
    <td>{nameFormatter(perpetrator)}</td>
    <td />
  </tr>
)

AllegationRow.propTypes = {
  displayVictim: React.PropTypes.bool.isRequired,
  perpetrator: React.PropTypes.object.isRequired,
  victim: React.PropTypes.object.isRequired,
}

export default AllegationRow

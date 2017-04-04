import React from 'react'
import nameFormatter from 'utils/nameFormatter'
import Select from 'react-select'

const AllegationRow = ({victim, perpetrator, displayVictim}) => (
  <tr>
    <td><strong>{displayVictim ? nameFormatter(victim) : ''}</strong></td>
    <td>{nameFormatter(perpetrator)}</td>
    <td>
      <Select
        aria-label={`allegations ${nameFormatter(victim)} ${nameFormatter(perpetrator)}`}
        multi
        inputProps={{id: `allegations_${victim.get('id')}_${perpetrator.get('id')}`}}
        value={''}
        onChange={() => null}
        options={[
          {label: 'General neglect', value: 'General neglect'},
          {label: 'Severe neglect', value: 'Severe neglect'},
          {label: 'Physical abuse', value: 'Physical abuse'},
          {label: 'Sexual abuse', value: 'Sexual abuse'},
          {label: 'Emotional abuse', value: 'Emotional abuse'},
          {label: 'Caretaker absent/incapacity', value: 'Caretaker absent/incapacity'},
          {label: 'Exploitation', value: 'Exploitation'},
          {label: 'Sibling at risk', value: 'Sibling at risk'},
        ]}
        clearable={false}
        placeholder=''
      />
    </td>
  </tr>
)

AllegationRow.propTypes = {
  displayVictim: React.PropTypes.bool.isRequired,
  perpetrator: React.PropTypes.object.isRequired,
  victim: React.PropTypes.object.isRequired,
}

export default AllegationRow

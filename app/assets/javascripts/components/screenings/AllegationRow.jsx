import React from 'react'
import PropTypes from 'prop-types'
import nameFormatter from 'utils/nameFormatter'
import Select from 'react-select'
import Immutable from 'immutable'

const AllegationRow = ({victim, perpetrator, displayVictim, onChange, allegationTypes}) => (
  <tr>
    <td><strong>{displayVictim ? nameFormatter(victim) : ''}</strong></td>
    <td>{nameFormatter(perpetrator)}</td>
    <td>
      <Select
        aria-label={`allegations ${nameFormatter(victim)} ${nameFormatter(perpetrator)}`}
        multi
        inputProps={{id: `allegations_${victim.get('id')}_${perpetrator.get('id')}`}}
        value={allegationTypes.toJS()}
        onChange={(allegationTypes) => onChange(victim.get('id'), perpetrator.get('id'), Immutable.List(allegationTypes.map((type) => type.value)) || [])}
        options={[
          {label: 'General neglect', value: 'General neglect'},
          {label: 'Severe neglect', value: 'Severe neglect'},
          {label: 'Physical abuse', value: 'Physical abuse'},
          {label: 'Sexual abuse', value: 'Sexual abuse'},
          {label: 'Emotional abuse', value: 'Emotional abuse'},
          {label: 'Caretaker absent/incapacity', value: 'Caretaker absent/incapacity'},
          {label: 'Exploitation', value: 'Exploitation'},
          {label: 'At risk, sibling abused', value: 'At risk, sibling abused'},
        ]}
        clearable={false}
        placeholder=''
      />
    </td>
  </tr>
)

AllegationRow.propTypes = {
  allegationTypes: PropTypes.object,
  displayVictim: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  perpetrator: PropTypes.object.isRequired,
  victim: PropTypes.object.isRequired,
}

export default AllegationRow

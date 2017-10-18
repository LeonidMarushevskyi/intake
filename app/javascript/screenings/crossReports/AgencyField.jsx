import PropTypes from 'prop-types'
import React from 'react'
import CheckboxField from 'common/CheckboxField'
import SelectField from 'common/SelectField'
import {
  AGENCY_TYPES,
} from 'enums/CrossReport'

const AgencyField = ({
  actions: {
    clearAllAgencyFields,
    setAgencyTypeField,
    setAgencyField,
    touchAgencyField,
    touchField,
  },
  type,
  countyAgencies,
  data: {
    selected,
    agency: {value},
  },
}) => (
  <div>
    <CheckboxField
      id={`type-${type}`}
      checked={selected}
      disabled={countyAgencies.length === 0}
      label={AGENCY_TYPES[type]}
      onChange={({target: {checked}}) => {
        setAgencyTypeField(type, checked)
        touchField(type)
        clearAllAgencyFields(type)
      }}
      // required={this.props.isAgencyRequired(agencyType)}
      value={type}
    />
    {
      selected &&
        <SelectField
          id={`${type}-agency-code`}
          label={`${AGENCY_TYPES[type]} agency name`}
          required
          onChange={({target: {value}}) => {
            setAgencyField(type, value)
            touchAgencyField(type)
          }}
          value={value}
        >
          <option key='' />
          {countyAgencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}
        </SelectField>
    }
  </div>
)
AgencyField.propTypes = {
  actions: PropTypes.object.isRequired,
  countyAgencies: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}

export default AgencyField

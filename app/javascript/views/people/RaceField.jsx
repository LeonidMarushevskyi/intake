import PropTypes from 'prop-types'
import React from 'react'
import CheckboxField from 'common/CheckboxField'
import SelectField from 'common/SelectField'

const RaceField = ({personId, onRaceChange, onRaceDetailChange, race, raceDetail, raceDetailOptions, checked, disabled}) => (
  <div className='half-gap-bottom'>
    <CheckboxField
      checked={checked}
      disabled={disabled}
      id={`participant-${personId}-race-${race.replace(/ /gi, '_')}`}
      label={race}
      onChange={({target: {checked}}) => onRaceChange(race, checked)}
      value={race}
    />
    {checked && Boolean(raceDetailOptions.length) &&
      <SelectField
        id={`participant-${personId}-${race.replace(/ /gi, '_')}-race-detail`}
        label=''
        value={raceDetail}
        onChange={({target: {value}}) => onRaceDetailChange(race, value)}
      >
        <option key='' value=''/>
        {raceDetailOptions.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
      </SelectField>
    }
  </div>
)
RaceField.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onRaceChange: PropTypes.func,
  onRaceDetailChange: PropTypes.func,
  personId: PropTypes.string,
  race: PropTypes.string,
  raceDetail: PropTypes.string,
  raceDetailOptions: PropTypes.array,
}
export default RaceField

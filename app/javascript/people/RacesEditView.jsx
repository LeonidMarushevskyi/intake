import CheckboxField from 'common/CheckboxField'
import Immutable from 'immutable'
import RACES from 'enums/Races'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'common/SelectField'
import bestMatchesByRace from 'utils/raceHelper'

export class RacesEditView extends React.Component {
  constructor() {
    super(...arguments)
  }

  changeRace(selectedRace, isChecked) {
    const races = bestMatchesByRace(this.props.races)
    if (isChecked) {
      let newRaces
      if (RACES[selectedRace].exclusive) {
        newRaces = Immutable.fromJS([{race: selectedRace}])
      } else {
        newRaces = races.push(Immutable.Map({race: selectedRace}))
      }
      this.props.onChange(newRaces)
    } else {
      this.props.onChange(races.filterNot((item) => item.get('race') === selectedRace))
    }
  }

  changeRaceDetail(race, selectedRaceDetail) {
    const races = bestMatchesByRace(this.props.races)
    const index = races.toJS().findIndex((item) => item.race === race)
    let newRaces
    if (selectedRaceDetail) {
      newRaces = races.set(index, Immutable.Map({race: race, race_detail: selectedRaceDetail}))
    } else {
      newRaces = races.set(index, Immutable.Map({race: race}))
    }
    this.props.onChange(newRaces)
  }

  persistedRaceInfo(race) {
    return bestMatchesByRace(this.props.races).toJS().find((item) => item.race === race)
  }

  raceData() {
    const persistedRaces = bestMatchesByRace(this.props.races).toJS()
    const exclusiveRaceSelected = persistedRaces.find(({race}) => RACES[race].exclusive)

    const raceData = Object.keys(RACES).map((race) => {
      const persistedRaceInfo = this.persistedRaceInfo(race)
      return {
        race: race,
        selected: Boolean(persistedRaceInfo),
        raceDetails: RACES[race].raceDetails,
        selectedRaceDetail: persistedRaceInfo && persistedRaceInfo.race_detail,
        disabled: exclusiveRaceSelected && !persistedRaceInfo,
      }
    })
    return raceData
  }

  renderRaceAndRaceDetails(raceData) {
    const {id} = this.props
    return (
      <div className='col-md-6'>
        <ul className='unstyled-list'>
          {raceData.map((item) => {
            const {race, selected, raceDetails, selectedRaceDetail, disabled} = item
            const raceId = race.replace(/ /gi, '_')
            return (
              <li key={race}>
                <div className='half-gap-bottom'>
                  <CheckboxField
                    key={race}
                    id={`${id}-race-${raceId}`}
                    value={race}
                    label={race}
                    checked={selected}
                    disabled={disabled}
                    onChange={(event) => this.changeRace(race, event.target.checked)}
                  />
                  {selected && raceDetails &&
                    <SelectField
                      id={`${id}-${raceId}-race-detail`}
                      label={''}
                      value={selectedRaceDetail}
                      onChange={(event) => this.changeRaceDetail(race, event.target.value)}
                    >
                      <option key='' value='' />
                      {raceDetails.map((raceDetail) => <option key={raceDetail} value={raceDetail}>{raceDetail}</option>)}
                    </SelectField>
                  }
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  render() {
    const raceData = this.raceData()
    const startIndex = 0
    const halfIndex = 4
    return (
      <div className='gap-top' id='race'>
        <fieldset className='fieldset-inputs'>
          <label>Race</label>
          <div className='row'>
            {this.renderRaceAndRaceDetails(raceData.slice(startIndex, halfIndex))}
            {this.renderRaceAndRaceDetails(raceData.slice(halfIndex))}
          </div>
        </fieldset>
      </div>
    )
  }
}

RacesEditView.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  races: PropTypes.object.isRequired,
}

export default RacesEditView

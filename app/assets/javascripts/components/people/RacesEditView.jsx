import CheckboxField from 'components/common/CheckboxField'
import Immutable from 'immutable'
import RACES from 'Races'
import React from 'react'
import SelectField from 'components/common/SelectField'

export class RacesEditView extends React.Component {
  constructor() {
    super(...arguments)
  }

  changeRace(selectedRace, isChecked) {
    const {races} = this.props
    if (isChecked) {
      let newRaces
      if (RACES[selectedRace].exclusive) {
        newRaces = Immutable.fromJS([{race: selectedRace}])
      } else {
        newRaces = this.props.races.push(Immutable.Map({race: selectedRace}))
      }
      this.props.onChange(newRaces)
    } else {
      this.props.onChange(races.filterNot((item) => item.get('race') === selectedRace))
    }
  }

  changeRaceDetail(race, selectedRaceDetail) {
    const {races} = this.props
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
    return this.props.races.toJS().find((item) => item.race === race)
  }

  raceData() {
    const persistedRaces = this.props.races.toJS()
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
    return (
      <div className='col-md-6'>
        <ul className='unstyled-list'>
          {raceData.map((item) => {
            const {race, selected, raceDetails, selectedRaceDetail, disabled} = item
            const raceId = race.replace(/ /gi, '_')
            return (
              <li key={race}>
                <CheckboxField
                  key={race}
                  id={`race-${raceId}`}
                  value={race}
                  checked={selected}
                  disabled={disabled}
                  onChange={(event) => this.changeRace(race, event.target.checked)}
                />
                {selected && raceDetails &&
                  <SelectField
                    id={`${raceId}-race-detail`}
                    label={''}
                    value={selectedRaceDetail || ''}
                    onChange={(event) => this.changeRaceDetail(race, event.target.value)}
                  >
                    <option key='' value='' />
                    {raceDetails.map((raceDetail) => <option key={raceDetail} value={raceDetail}>{raceDetail}</option>)}
                  </SelectField>
                }
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
          {this.renderRaceAndRaceDetails(raceData.slice(startIndex, halfIndex))}
          {this.renderRaceAndRaceDetails(raceData.slice(halfIndex))}
        </fieldset>
        <hr />
      </div>
    )
  }
}

RacesEditView.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  races: React.PropTypes.object.isRequired,
}

export default RacesEditView

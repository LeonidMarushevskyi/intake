import React from 'react'
import PropTypes from 'prop-types'
import RaceField from 'views/people/RaceField'

const RaceForm = ({
  onRaceChange,
  onRaceDetailChange,
  racesDisabled,
  personId,
  raceDetailOptions,
  raceDetails,
  races,
}) => (
  <div className='row'>
    <div className='col-md-12 gap-top'>
      <div className='gap-top' id='race'>
        <fieldset className='fieldset-inputs'>
          <label>Race</label>
          <div className='row'>
            <div className='col-md-6'>
              <ul className='unstyled-list'>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='White'
                    raceDetailOptions={raceDetailOptions.White}
                    raceDetail={raceDetails.White}
                    checked={races.White}
                    onRaceChange={onRaceChange}
                    onRaceDetailChange={onRaceDetailChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Black or African American'
                    raceDetailOptions={raceDetailOptions['Black or African American']}
                    raceDetail={raceDetails['Black or African American']}
                    checked={races['Black or African American']}
                    onRaceChange={onRaceChange}
                    onRaceDetailChange={onRaceDetailChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Asian'
                    raceDetailOptions={raceDetailOptions.Asian}
                    raceDetail={raceDetails.Asian}
                    checked={races.Asian}
                    onRaceChange={onRaceChange}
                    onRaceDetailChange={onRaceDetailChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='American Indian or Alaska Native'
                    raceDetailOptions={raceDetailOptions['American Indian or Alaska Native']}
                    raceDetail={raceDetails['American Indian or Alaska Native']}
                    checked={races['American Indian or Alaska Native']}
                    onRaceChange={onRaceChange}
                    onRaceDetailChange={onRaceDetailChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Native Hawaiian or Other Pacific Islander'
                    raceDetailOptions={raceDetailOptions['Native Hawaiian or Other Pacific Islander']}
                    raceDetail={raceDetails['Native Hawaiian or Other Pacific Islander']}
                    checked={races['Native Hawaiian or Other Pacific Islander']}
                    onRaceChange={onRaceChange}
                    onRaceDetailChange={onRaceDetailChange}
                  />
                </li>
              </ul>
            </div>
            <div className='col-md-6'>
              <ul className='unstyled-list'>
                <li>
                  <RaceField
                    disabled={!races.Unknown && racesDisabled}
                    personId={personId}
                    race='Unknown'
                    raceDetailOptions={raceDetailOptions.Unknown}
                    checked={races.Unknown}
                    onRaceChange={onRaceChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races.Abandoned && racesDisabled}
                    personId={personId}
                    race='Abandoned'
                    raceDetailOptions={raceDetailOptions.Abandoned}
                    checked={races.Abandoned}
                    onRaceChange={onRaceChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races['Declined to answer'] && racesDisabled}
                    personId={personId}
                    race='Declined to answer'
                    raceDetailOptions={raceDetailOptions['Declined to answer']}
                    checked={races['Declined to answer']}
                    onRaceChange={onRaceChange}
                  />
                </li>
              </ul>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
)
RaceForm.propTypes = {
  onRaceChange: PropTypes.func,
  onRaceDetailChange: PropTypes.func,
  personId: PropTypes.string,
  raceDetailOptions: PropTypes.object,
  raceDetails: PropTypes.object,
  races: PropTypes.object,
  racesDisabled: PropTypes.bool,
}
export default RaceForm

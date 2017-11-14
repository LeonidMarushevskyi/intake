import React from 'react'
import PropTypes from 'prop-types'
import RaceField from 'views/people/RaceField'

const RaceForm = ({
  onChange,
  racesDisabled,
  personId,
  raceDetailOptions,
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
                    checked={races.White}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Black or African American'
                    raceDetailOptions={raceDetailOptions['Black or African American']}
                    checked={races['Black or African American']}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Asian'
                    raceDetailOptions={raceDetailOptions.Asian}
                    checked={races.Asian}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='American Indian or Alaska Native'
                    raceDetailOptions={raceDetailOptions['American Indian or Alaska Native']}
                    checked={races['American Indian or Alaska Native']}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Native Hawaiian or Other Pacific Islander'
                    raceDetailOptions={raceDetailOptions['Native Hawaiian or Other Pacific Islander']}
                    checked={races['Native Hawaiian or Other Pacific Islander']}
                    onChange={onChange}
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
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races.Abandoned && racesDisabled}
                    personId={personId}
                    race='Abandoned'
                    raceDetailOptions={raceDetailOptions.Abandoned}
                    checked={races.Abandoned}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races['Declined to answer'] && racesDisabled}
                    personId={personId}
                    race='Declined to answer'
                    raceDetailOptions={raceDetailOptions['Declined to answer']}
                    checked={races['Declined to answer']}
                    onChange={onChange}
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
  onChange: PropTypes.func,
  personId: PropTypes.string,
  raceDetailOptions: PropTypes.object,
  races: PropTypes.object,
  racesDisabled: PropTypes.bool,
}
export default RaceForm

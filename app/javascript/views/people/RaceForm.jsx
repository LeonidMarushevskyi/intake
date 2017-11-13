import React from 'react'
import PropTypes from 'prop-types'
import RaceField from 'views/people/RaceField'

const RaceForm = ({
  onChange,
  racesDisabled,
  personId,
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
                    raceDetailOptions={raceDetails.White}
                    checked={races.White.checked}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Black or African American'
                    raceDetailOptions={raceDetails['Black or African American']}
                    checked={races['Black or African American'].checked}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Asian'
                    raceDetailOptions={raceDetails.Asian}
                    checked={races.Asian.checked}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='American Indian or Alaska Native'
                    raceDetailOptions={raceDetails['American Indian or Alaska Native']}
                    checked={races['American Indian or Alaska Native'].checked}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={racesDisabled}
                    personId={personId}
                    race='Native Hawaiian or Other Pacific Islander'
                    raceDetailOptions={raceDetails['Native Hawaiian or Other Pacific Islander']}
                    checked={races['Native Hawaiian or Other Pacific Islander'].checked}
                    onChange={onChange}
                  />
                </li>
              </ul>
            </div>
            <div className='col-md-6'>
              <ul className='unstyled-list'>
                <li>
                  <RaceField
                    disabled={!races.Unknown.checked && racesDisabled}
                    personId={personId}
                    race='Unknown'
                    checked={races.Unknown.checked}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races.Abandoned.checked && racesDisabled}
                    personId={personId}
                    race='Abandoned'
                    checked={races.Abandoned.checked}
                    onChange={onChange}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races['Declined to answer'].checked && racesDisabled}
                    personId={personId}
                    race='Declined to answer'
                    checked={races['Declined to answer'].checked}
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
  raceDetails: PropTypes.object,
  races: PropTypes.object,
  racesDisabled: PropTypes.bool,
}
export default RaceForm

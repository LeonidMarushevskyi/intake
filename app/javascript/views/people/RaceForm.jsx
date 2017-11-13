import React from 'react'
import PropTypes from 'prop-types'
import RaceField from 'views/people/RaceField'

const RaceForm = ({
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
                    disabled={!races.White.checked && racesDisabled}
                    personId={personId}
                    race='White'
                    raceDetailOptions={raceDetails.White}
                    checked={races.White.checked}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races['Black or African American'].checked && racesDisabled}
                    personId={personId}
                    race='Black or African American'
                    raceDetailOptions={raceDetails['Black or African American']}
                    checked={races['Black or African American'].checked}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races.Asian.checked && racesDisabled}
                    personId={personId}
                    race='Asian'
                    raceDetailOptions={raceDetails.Asian}
                    checked={races.Asian.checked}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races['American Indian or Alaska Native'].checked && racesDisabled}
                    personId={personId}
                    race='American Indian or Alaska Native'
                    raceDetailOptions={raceDetails['American Indian or Alaska Native']}
                    checked={races['American Indian or Alaska Native'].checked}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races['Native Hawaiian or Other Pacific Islander'].checked && racesDisabled}
                    personId={personId}
                    race='Native Hawaiian or Other Pacific Islander'
                    raceDetailOptions={raceDetails['Native Hawaiian or Other Pacific Islander']}
                    checked={races['Native Hawaiian or Other Pacific Islander'].checked}
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
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races.Abandoned.checked && racesDisabled}
                    personId={personId}
                    race='Abandoned'
                    checked={races.Abandoned.checked}
                  />
                </li>
                <li>
                  <RaceField
                    disabled={!races['Declined to answer'].checked && racesDisabled}
                    personId={personId}
                    race='Declined to answer'
                    checked={races['Declined to answer'].checked}
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
  personId: PropTypes.string,
  raceDetails: PropTypes.object,
  races: PropTypes.object,
  racesDisabled: PropTypes.bool,
}
export default RaceForm

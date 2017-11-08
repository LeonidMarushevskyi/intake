import AvatarImg from '../../../assets/images/default-profile.svg'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'

const PersonInformationShow = ({
  approximate_age,
  date_of_birth,
  display_name,
  ethnicity,
  gender,
  languages,
  legacy_source,
  races,
  roles,
  ssn,
}) => {
  const showDateOfBirth = date_of_birth || !approximate_age
  return (
    <div>
      <div className='row'>
        <div className='col-md-2'><img src={AvatarImg}/></div>
        <div className='col-md-10'>
          {legacy_source &&
            <div className='row'><div className='col-md-12'><span>{legacy_source}</span></div></div>
          }
          <div className='row'>
            <div className='col-md-5'>
              <ShowField label='Name'>{display_name}</ShowField>
              <ShowField label='Gender'>{gender}</ShowField>
            </div>
            <div className='col-md-5'>
              <ShowField label='Role(s)'>
                {roles &&
                  <ul>{roles.map((role, index) => (<li key={`role-${index}`}>{role}</li>))}</ul>
                }
              </ShowField>
            </div>
            <div className='col-md-5'>
              <ShowField label='Language(s) (Primary First)'>{languages}</ShowField>
            </div>
            <div className='col-md-5'>
              {showDateOfBirth && <ShowField label='Date of birth'>{date_of_birth}</ShowField>}
              {!showDateOfBirth && <ShowField label='Approximate Age'>{approximate_age}</ShowField>}
              <ShowField label='Social security number'>{ssn}</ShowField>
            </div>
          </div>
        </div>
      </div>
      <div className='row gap-top'>
        <ShowField gridClassName='col-md-12' label='Race'>{races}</ShowField>
      </div>
      <div className='row gap-top'>
        <ShowField gridClassName='col-md-12' label='Hispanic/Latino Origin'>
          {ethnicity}
        </ShowField>
      </div>
    </div>
  )
}

PersonInformationShow.propTypes = {
  approximate_age: PropTypes.string,
  date_of_birth: PropTypes.string,
  display_name: PropTypes.string,
  ethnicity: PropTypes.string,
  gender: PropTypes.string,
  languages: PropTypes.string,
  legacy_source: PropTypes.string,
  races: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
  ssn: PropTypes.string,
}

export default PersonInformationShow
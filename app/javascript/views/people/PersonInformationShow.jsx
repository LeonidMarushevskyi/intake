import AvatarImg from '../../../assets/images/default-profile.svg'
import PropTypes from 'prop-types'
import React from 'react'
import ShowField from 'common/ShowField'

const PersonInformationShow = ({
  approximateAge,
  dateOfBirth,
  ethnicity,
  gender,
  languages,
  legacySource,
  name,
  races,
  roles,
  ssn,
}) => (
  <div>
    <div className='row'>
      <div className='col-md-2'><img src={AvatarImg}/></div>
      <div className='col-md-10'>
        {legacySource &&
            <div className='row'><div className='col-md-12'><span>{legacySource}</span></div></div>
        }
        <div className='row'>
          <div className='col-md-5'>
            <ShowField label='Name'>{name}</ShowField>
            <ShowField label='Gender'>{gender}</ShowField>
          </div>
          <div className='col-md-5'>
            <ShowField label='Role(s)'>
              {roles.length > 0 &&
                  <ul>{roles.map((role, index) => (<li key={`role-${index}`}>{role}</li>))}</ul>
              }
            </ShowField>
          </div>
          <div className='col-md-5'>
            <ShowField label='Language(s) (Primary First)'>{languages}</ShowField>
          </div>
          <div className='col-md-5'>
            {dateOfBirth && <ShowField label='Date of birth'>{dateOfBirth}</ShowField>}
            {approximateAge && <ShowField label='Approximate Age'>{approximateAge}</ShowField>}
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

PersonInformationShow.propTypes = {
  approximateAge: PropTypes.string,
  dateOfBirth: PropTypes.string,
  ethnicity: PropTypes.string,
  gender: PropTypes.string,
  languages: PropTypes.string,
  legacySource: PropTypes.string,
  name: PropTypes.string,
  races: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
  ssn: PropTypes.string,
}

export default PersonInformationShow
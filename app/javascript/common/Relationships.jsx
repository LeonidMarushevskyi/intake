import PropTypes from 'prop-types'
import React from 'react'

const attachLink = (onClick, realtionship, Id) => (
  <a onClick = {() => { onClick(realtionship, Id) }}>&nbsp;Attach</a>
)

export const Relationships = ({people, onClick, snapshotId, screeningId, isScreening}) => (
  <div className='card-body no-pad-top'>
    {
      people.map((person, index) => (
        <div className='row' key={index}>
          <div className='col-md-6 gap-top'>
            <span className='person'>{person.name}</span>
            {
              (person.relationships.length > 0) &&
              <span>
                <strong> is the...</strong>
                <ul className='relationships'>
                  {
                    person.relationships.map((relationship, index) => (
                      <li key={index}>
                        <strong>{ relationship.type }</strong> &nbsp; of { relationship.relatee }
                        {relationship.person_card_exists &&
                          (isScreening ? attachLink(onClick, relationship, screeningId) : attachLink(onClick, relationship, snapshotId))
                        }
                      </li>
                    ))
                  }
                </ul>
              </span>
            }
            {
              (person.relationships.length === 0) &&
              <strong className='relationships'> has no known relationships</strong>
            }
          </div>
        </div>
      ))
    }
  </div>
)

Relationships.propTypes = {
  isScreening: PropTypes.bool,
  onClick: PropTypes.func,
  people: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    relationships: PropTypes.arrayOf(PropTypes.shape({
      relatee: PropTypes.string,
      type: PropTypes.string,
    })),
  })),
  screeningId: PropTypes.string,
  snapshotId: PropTypes.string,
}

export const EmptyRelationships = () => (
  <div className='card-body no-pad-top'>
    <div className='row'>
      <div className='col-md-12 empty-relationships'>
        <div className='double-gap-top  centered'>
          <span className='c-dark-grey'>Search for people and add them to see their relationships.</span>
        </div>
      </div>
    </div>
  </div>
)

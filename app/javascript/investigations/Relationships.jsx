import PropTypes from 'prop-types'
import React from 'react'

export const Relationships = ({people, relationships}) => (
  <div className='card-body no-pad-top'>
    {
      people.map((person) => (
        <div className='row' key={1}>
          <div className='col-md-6 gap-top'>
            <span className='person'>{person}</span>
            <span>
              <strong> is the...</strong>
              <ul className='relationships'>
                {
                  relationships.map((relationship, index) => (relationship.person === person && (
                    <li key={index}>
                      <strong>{ relationship.relationship }</strong> &nbsp; of { relationship.relatee }
                    </li>
                  )))
                }
              </ul>
            </span>
          </div>
        </div>))
    }
  </div>
)

Relationships.propTypes = {
  people: PropTypes.array,
  relationships: PropTypes.arrayOf(PropTypes.shape({
    person: PropTypes.string,
    relatedTo: PropTypes.string,
    relationship: PropTypes.string,
  })),
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

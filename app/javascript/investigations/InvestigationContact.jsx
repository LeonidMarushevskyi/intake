import React from 'react'
import PropTypes from 'prop-types'

const InvestigationContact = ({investigationId}) => (
  <h1>{`New Contact - Investigation ${investigationId}`}</h1>
)

InvestigationContact.propTypes = {
  investigationId: PropTypes.string.isRequired,
}

export default InvestigationContact

import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {nWords} from 'utils/textFormatter'

const MAX_NUMBER_OF_WORDS = 30
const ContactLogRow = ({id, investigationId, startedAt, people, method, status, note}) => {
  const contactPath = `/investigations/${investigationId}/contacts/${id}`
  return (
    <tr>
      <td>{startedAt}</td>
      <td>{people.join(', ')}</td>
      <td>
        <div>{method}</div>
        <div>({status})</div>
      </td>
      <td>
        <div>{nWords(note, MAX_NUMBER_OF_WORDS)}</div>
        <Link to={contactPath} target='_blank'>View contact</Link>
      </td>
    </tr>
  )
}

ContactLogRow.propTypes = {
  id: PropTypes.string,
  investigationId: PropTypes.string,
  method: PropTypes.string,
  note: PropTypes.string,
  people: PropTypes.arrayOf(PropTypes.string),
  startedAt: PropTypes.string,
  status: PropTypes.string,
}

export default ContactLogRow

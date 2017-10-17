import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import {dateTimeFormatter} from 'utils/dateFormatter'

class ContactShow extends Component {
  componentDidMount() {
    const {investigationId, id, actions: {fetch}} = this.props
    fetch(investigationId, id)
  }
  render() {
    const {
      communicationMethod,
      investigationId,
      location,
      note,
      people,
      purpose,
      startedAt,
      status,
    } = this.props
    return (
      <div className='card show double-gap-top'>
        <div className='card-header'>
          <span>{`Contact - Investigation ${investigationId}`}</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='row'>
                <ShowField gridClassName='col-md-12' label='Date & Time'>
                  {`(${dateTimeFormatter(startedAt)})`}
                </ShowField>
              </div>
              <div className='row'>
                <ShowField gridClassName='col-md-12' label='Communication Method'>
                  {communicationMethod}
                </ShowField>
              </div>
              <div className='row'>
                <ShowField gridClassName='col-md-12' label='Location'>
                  {location}
                </ShowField>
              </div>
              <div className='row'>
                <ShowField gridClassName='col-md-12' label='Status'>
                  {status}
                </ShowField>
              </div>
              <div className='row'>
                <ShowField gridClassName='col-md-12' label='People present'>
                  <ul className='list-unstyled'>
                    {people.map((person, index) => (<li key={index}>{person}</li>))}
                  </ul>
                </ShowField>
              </div>
              <div className='row'>
                <ShowField gridClassName='col-md-12' label='Purpose'>
                  {purpose}
                </ShowField>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='row'>
                <ShowField gridClassName='col-md-12' label='Contact Notes (Optional)'>
                  {note}
                </ShowField>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ContactShow.propTypes = {
  actions: PropTypes.object,
  communicationMethod: PropTypes.string,
  id: PropTypes.string.isRequired,
  investigationId: PropTypes.string.isRequired,
  location: PropTypes.string,
  note: PropTypes.string,
  people: PropTypes.array,
  purpose: PropTypes.string,
  startedAt: PropTypes.string,
  status: PropTypes.string,
}

export default ContactShow

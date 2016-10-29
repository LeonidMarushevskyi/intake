import Immutable from 'immutable'
import ParticipantEditView from 'components/screenings/ParticipantEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipantEditView', () => {
  let wrapper
  beforeEach(() => {
    const participant = Immutable.fromJS({
      id: 199,
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: '2016-12-31',
      gender: 'female',
      ssn: 'ssn-1',
    })
    wrapper = shallow(<ParticipantEditView participant={participant} />)
  })

  it('renders a participant edit view card', () => {
    expect(wrapper.find('.card.edit').length).toEqual(1)
    expect(wrapper.find('#participants-card-199').length).toEqual(1)
  })

  it('renders the participants first and last name in the card header', () => {
    expect(wrapper.find('.card-header').text()).toContain('Lisa Simpson')
  })

  it('renders the delete link', () => {
    expect(wrapper.find('.fa-times').length).toEqual(1)
  })

  it('renders the participant inputs', () => {
    expect(wrapper.find('input').length).toEqual(5)
    expect(wrapper.find('input[type="hidden"]').props().value).toEqual(199)
    expect(wrapper.find('input').nodes.map((node) => node.props.value)).toEqual([
      199,
      'Lisa',
      'Simpson',
      '2016-12-31',
      'ssn-1',
    ])
  })

  it('renders the participant gender', () => {
    expect(wrapper.find('select').props().value).toEqual('female')
  })

  it('renders the labels of the participant card ', () => {
    expect(wrapper.find('label').length).toEqual(5)
    expect(wrapper.find('label').map((element) => element.text())).toEqual([
      'First Name',
      'Last Name',
      'Date of birth',
      'Gender',
      'Social security number',
    ])
  })

  it('renders the save button', () => {
    expect(wrapper.find('.btn.btn-primary').text()).toEqual('Save')
  })

  it('renders the cancel link', () => {
    expect(wrapper.find('.btn.btn-default').text()).toEqual('Cancel')
  })
})

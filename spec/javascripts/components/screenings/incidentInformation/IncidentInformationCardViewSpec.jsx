import IncidentInformationCardView from 'screenings/IncidentInformationCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('IncidentInformationCardView', () => {
  let component
  const props = {
    screening: Immutable.fromJS({
    }),
    errors: Immutable.Map(),
    editable: true,
  }

  beforeEach(() => {
    props.onCancel = jasmine.createSpy('onCancel')
    props.onChange = jasmine.createSpy('onChange')
    props.onSave = jasmine.createSpy('onSave')
    props.onEdit = jasmine.createSpy('onEdit')
  })

  it('renders the card header', () => {
    const component = shallow(<IncidentInformationCardView {...props} mode='edit'/>)
    const header = component.find('ScreeningCardHeader')
    expect(header.length).toEqual(1)
    expect(header.props().onEdit).toEqual(component.instance().onEdit)
    expect(header.props().showEdit).toEqual(false)
    expect(header.props().title).toEqual('Incident Information')
  })

  describe('render', () => {
    describe('when mode is set to show', () => {
      beforeEach(() => {
        component = shallow(<IncidentInformationCardView {...props} mode='show'/>)
      })
      it('renders the incident show card', () => {
        expect(component.find('Connect(IncidentInformationShow)').length).toEqual(1)
      })
    })

    describe('when mode is set to edit', () => {
      beforeEach(() => {
        component = shallow(<IncidentInformationCardView {...props} mode='edit'/>)
      })
      it('renders the incident edit card', () => {
        expect(component.find('Connect(IncidentInformationForm)').length).toEqual(1)
      })
    })
  })
})

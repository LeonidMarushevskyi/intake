import React from 'react'
import Immutable from 'immutable'
import NarrativeShowView from 'screenings/NarrativeShowView'
import {shallow} from 'enzyme'

describe('NarrativeShowView', () => {
  let screening
  let component
  let onEdit

  describe('with VALID data', () => {
    beforeEach(() => {
      screening = Immutable.fromJS({
        report_narrative: 'some narrative',
      })
      onEdit = jasmine.createSpy()
      component = shallow(<NarrativeShowView screening={screening} errors={Immutable.Map()} onEdit={onEdit} />)
    })

    it('renders a show card with narative-card as id', () => {
      expect(component.props().id).toEqual('narrative-card')
      expect(component.props().className).toContain('show')
    })

    it('renders the card header', () => {
      expect(component.find('.card-header').text()).toContain('Narrative')
    })

    it('renders the report narrative label as required', () => {
      expect(component.find('ShowField[label="Report Narrative"]').props().required)
        .toEqual(true)
    })

    it('renders the edit link', () => {
      expect(component.find('EditLink').props().ariaLabel).toEqual('Edit narrative')
    })

    it('renders the narrative show field', () => {
      expect(component.find('ShowField').length).toEqual(1)
      expect(component.find('ShowField[label="Report Narrative"]').html())
        .toContain('some narrative')
    })

    it('calls the onEdit function when edit link is clicked', () => {
      component.find('EditLink').simulate('click')
      expect(onEdit).toHaveBeenCalled()
    })
  })

  describe('with INVALID data', () => {
    const errors = Immutable.fromJS({report_narrative: ['That is not a report narrative, this is a report narrative']})
    beforeEach(() => {
      screening = Immutable.fromJS({
        report_narrative: 'some narrative',
      })
      onEdit = jasmine.createSpy()
      component = shallow(<NarrativeShowView screening={screening} errors={errors} onEdit={onEdit} />)
    })

    it('renders the narrative show field', () => {
      expect(component.find('ShowField').html()).toContain(errors.get('report_narrative').first())
    })
  })
})

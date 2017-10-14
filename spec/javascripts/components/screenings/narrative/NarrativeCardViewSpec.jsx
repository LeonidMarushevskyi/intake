import NarrativeCardView from 'screenings/NarrativeCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('NarrativeCardView', () => {
  const renderNarrativeCard = ({editable = true, ...args}) => {
    const props = {editable, ...args}
    return shallow(<NarrativeCardView {...props} />)
  }

  it('renders the card header', () => {
    const component = renderNarrativeCard({mode: 'edit'})
    const header = component.find('ScreeningCardHeader')
    expect(header.exists()).toEqual(true)
    expect(header.props().onEdit).toEqual(component.instance().onEdit)
    expect(header.props().showEdit).toEqual(false)
    expect(header.props().title).toEqual('Narrative')
  })

  describe('render', () => {
    describe('when the mode is set to edit', () => {
      it('renders the edit view', () => {
        const component = renderNarrativeCard({mode: 'edit'})
        const narrativeForm = component.find('Connect(NarrativeForm)')
        expect(narrativeForm.exists()).toEqual(true)
        expect(narrativeForm.props().toggleShow).toEqual(component.instance().toggleShow)
      })
    })

    describe('when the mode is set to show', () => {
      it('renders the show view', () => {
        const component = renderNarrativeCard({mode: 'show'})
        expect(component.find('Connect(NarrativeShow)').exists()).toEqual(true)
      })
    })
  })
})

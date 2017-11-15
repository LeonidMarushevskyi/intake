import AllegationsCardView from 'screenings/AllegationsCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('AllegationsCardView', () => {
  const renderAllegationsCard = ({...props}) => (
    shallow(<AllegationsCardView {...props} />)
  )

  describe('render', () => {
    describe('when the mode is set to edit', () => {
      it('renders the edit view', () => {
        const component = renderAllegationsCard({mode: 'edit'})
        const allegationsForm = component.find('Connect(AllegationsForm)')
        expect(allegationsForm.exists()).toEqual(true)
        expect(allegationsForm.props().toggleMode).toEqual(component.instance().toggleMode)
      })
    })

    describe('when the mode is set to show', () => {
      it('renders the show view', () => {
        const component = renderAllegationsCard({mode: 'show'})
        const allegationsShow = component.find('Connect(AllegationShow)')
        expect(allegationsShow.exists()).toEqual(true)
        expect(allegationsShow.props().toggleMode).toEqual(component.instance().toggleMode)
      })
    })
  })
})

import WorkerSafetyCardView from 'screenings/WorkerSafetyCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('WorkerSafetyCardView', () => {
  const renderWorkerSafetyCard = ({editable = true, ...args}) => {
    const props = {editable, ...args}
    return shallow(<WorkerSafetyCardView {...props} />)
  }

  describe('render', () => {
    describe('when the mode is set to edit', () => {
      it('renders the edit view', () => {
        const component = renderWorkerSafetyCard({mode: 'edit'})
        const workerSafetyForm = component.find('Connect(WorkerSafetyForm)')
        expect(workerSafetyForm.exists()).toEqual(true)
        expect(workerSafetyForm.props().toggleShow).toEqual(component.instance().toggleShow)
      })
    })

    describe('when the mode is set to show', () => {
      it('renders the show view', () => {
        const component = renderWorkerSafetyCard({mode: 'show'})
        expect(component.find('Connect(WorkerSafetyShow)').exists()).toEqual(true)
      })
    })
  })
})

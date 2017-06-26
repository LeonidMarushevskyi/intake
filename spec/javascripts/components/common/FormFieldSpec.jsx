import React from 'react'
import Immutable from 'immutable'
import {shallow} from 'enzyme'
import FormField from 'components/common/FormField'

describe('FormField', () => {
  let component

  describe('when no props are passed', () => {
    it('renders a lebel with a div wrapper', () => {
      const props = {
        children: <div>Italy</div>,
        label: 'L1',
      }
      component = shallow(<FormField {...props}/>)
      expect(component.html())
        .toEqual('<div class=""><label class="">L1</label><div>Italy</div><div></div></div>')
    })
  })

  describe('when label and className props are passed', () => {
    const props = {
      children: <br/>,
      label: 'Do not judge a component by its label',
      labelClassName: 'working-class object-oriendted-class',
      gridClassName: 'giggidy',
    }

    it('renders the label inside the grid wrapper with the classes', () => {
      component = shallow(<FormField {...props}/>)
      expect(component.find('div.giggidy').find('label').props()
        .className).toEqual('working-class object-oriendted-class')
    })
  })

  describe('when children are passed', () => {
    const props = {
      children: <h1>Child</h1>,
      label: 'Do not judge a component by its label',
      labelClassName: 'working-class object-oriendted-class',
      gridClassName: 'giggidy',
    }

    it('renders the children between the label and ErrorMessages', () => {
      const wrapper = shallow(<FormField {...props}/>).first('div')
      expect(wrapper.children().length).toEqual(3)
      expect(wrapper.childAt(0).type()).toEqual('label')
      expect(wrapper.childAt(1).html()).toEqual('<h1>Child</h1>')
      expect(wrapper.find('ErrorMessages').exists()).toEqual(true)
    })
  })

  describe('when errors are passed', () => {
    const props = {
      children: <br/>,
      label: 'Do not judge a component by its label',
      gridClassName: 'working-class object-oriendted-class',
      labelClassName: 'trouble-maker',
      errors: Immutable.List(['Please choose wisely.', 'Stick to the plan!']),
    }

    it('renders label and its wrapper with error classes', () => {
      component = shallow(<FormField {...props}/>)
      expect(component.find('label.trouble-maker.input-error-label').parent().props()
        .className).toEqual('working-class object-oriendted-class input-error')
    })

    it('renders ErrorMessages and pass it errors', () => {
      component = shallow(<FormField {...props}/>)
      expect(component.find('ErrorMessages').props().errors)
        .toEqual(Immutable.List(['Please choose wisely.', 'Stick to the plan!']))
    })

    describe('when required', () => {
      beforeEach(() => {
        component = shallow(<FormField {...props} required/>)
      })

      it('renders label as required', () => {
        expect(component.find('label').props().className).toContain('required')
      })
    })
  })

  describe('when no errors passed', () => {
    const props = {
      children: <br/>,
      label: 'Do not judge a component by its label',
      gridClassName: 'working-class object-oriendted-class',
      labelClassName: 'trouble-maker',
    }

    beforeEach(() => {
      component = shallow(<FormField {...props} required/>)
    })

    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(component.find('.input-error-label').length).toEqual(0)
    })

    it('renders ErrorMessages but with no errors', () => {
      expect(component.find('ErrorMessages').exists()).toEqual(true)
      expect(component.find('ErrorMessages').props().errors).toEqual(undefined)
    })

    describe('when is required', () => {
      it('renders required class', () => {
        expect(component.find('label').props().className)
          .toEqual('trouble-maker required')
      })
    })
  })
})

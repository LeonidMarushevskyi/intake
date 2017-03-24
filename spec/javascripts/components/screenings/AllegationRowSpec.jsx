import React from 'react'
import AllegationRow from 'components/screenings/AllegationRow'
import Immutable from 'immutable'
import {shallow} from 'enzyme'

describe('AllegationRow', () => {
  const bart = Immutable.fromJS({first_name: 'Bart', last_name: 'Simpson'})
  const homer = Immutable.fromJS({first_name: 'Homer', last_name: 'Simpson'})

  const requiredProps = {
    victim: bart,
    perpetrator: homer,
  }

  it('renders victim and perpetrator', () => {
    const component = shallow(<AllegationRow {...requiredProps} displayVictim={true} />)
    expect(component.childAt(0).text()).toEqual('Bart Simpson')
    expect(component.childAt(1).text()).toEqual('Homer Simpson')
  })

  it('does not render victim when displayVictim is false', () => {
    const component = shallow(<AllegationRow {...requiredProps} displayVictim={false} />)
    expect(component.childAt(0).text()).toEqual('')
    expect(component.childAt(1).text()).toEqual('Homer Simpson')
  })
})

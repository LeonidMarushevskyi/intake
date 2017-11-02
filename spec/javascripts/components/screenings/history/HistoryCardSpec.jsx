import * as Immutable from 'immutable'
import * as IntakeConfig from 'common/config'
import HistoryCard from 'screenings/HistoryCard'
import React from 'react'
import clipboard from 'clipboard-js'
import {shallow, mount} from 'enzyme'
import * as config from 'common/config'

describe('HistoryCard', () => {
  const requiredProps = {
    actions: {},
    involvements: Immutable.fromJS({screenings: [], referrals: [], cases: []}),
    participants: Immutable.List(),
    screeningId: '33',
  }

  describe('#render', () => {
    describe('release two is inactive', () => {
      beforeEach(() => {
        spyOn(IntakeConfig, 'isFeatureInactive')
        IntakeConfig.isFeatureInactive.and.returnValue(true)
      })

      it("renders 'Add a person...' Copy when no involvements are present", () => {
        const component = shallow(<HistoryCard {...requiredProps}/>)
        expect(component.find('table').length).toEqual(0)
        expect(component.text()).toContain('Search for people and add them to see their child welfare history.')
      })

      it('does not render table when no involvements are present', () => {
        const component = shallow(<HistoryCard {...requiredProps}/>)
        expect(component.find('table').length).toEqual(0)
      })

      it('renders table headings when there are involvements', () => {
        const involvements = Immutable.fromJS({screenings: [{}]})
        const props = {...requiredProps, involvements}
        const component = shallow(<HistoryCard {...props}/>)

        const tr = component.find('thead tr')
        expect(tr.text()).toContain('Date')
        expect(tr.text()).toContain('Type/Status')
        expect(tr.text()).toContain('County/Office')
        expect(tr.text()).toContain('People and Roles')
      })

      it('renders screenings, if present', () => {
        const involvements = Immutable.fromJS({screenings: [{}]})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const screeningCards = component.find('HistoryCardScreening')
        expect(screeningCards.length).toEqual(1)
      })

      it('does not render screenings if empty', () => {
        const involvements = Immutable.fromJS({screenings: []})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const screeningCards = component.find('HistoryCardScreening')
        expect(screeningCards.length).toEqual(0)
      })

      it('renders referrals, if present', () => {
        const involvements = Immutable.fromJS({referrals: [{}]})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const referralCards = component.find('HistoryCardReferral')
        expect(referralCards.length).toEqual(1)
      })

      it('does not render referrals if empty', () => {
        const involvements = Immutable.fromJS({referrals: []})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const referralCards = component.find('HistoryCardReferral')
        expect(referralCards.length).toEqual(0)
      })

      it('renders cases, if present', () => {
        const involvements = Immutable.fromJS({cases: [{}]})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const caseCards = component.find('HistoryCardCase')
        expect(caseCards.length).toEqual(1)
      })

      it('does not render cases if empty', () => {
        const involvements = Immutable.fromJS({cases: []})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const caseCards = component.find('HistoryCardCase')
        expect(caseCards.length).toEqual(0)
      })

      describe('copy button', () => {
        const involvements = Immutable.fromJS({screenings: [Immutable.fromJS({id: 1})]})
        it('shows help text instead of copybutton', () => {
          spyOn(config, 'jsClipboardSupported').and.returnValue(false)
          const component = shallow(<HistoryCard {...requiredProps} involvements={involvements} />)
          expect(component.find('button[children="Copy"]').length).toEqual(0)
          expect(component.text()).toContain(
            'To copy the history to your clipboard, highlight the table above, click the right button of your mouse, and select "Copy."'
          )
        })
        it('does not render if there are no involvements', () => {
          const component = shallow(<HistoryCard {...requiredProps} />)
          expect(component.find('button[children="Copy"]').length).toEqual(0)
        })
        it('has an onClick callback', () => {
          const component = shallow(<HistoryCard {...requiredProps} involvements={involvements} />)
          const copyButton = component.find('button[children="Copy"]')
          expect(copyButton.props().onClick).toEqual(jasmine.any(Function))
        })
        it('calls the clipboard library', () => {
          spyOn(clipboard, 'copy')
          const wrapper = mount(<HistoryCard {...requiredProps} involvements={involvements} />)
          const resultsTable = wrapper.find('table').node
          wrapper.find('button[children="Copy"]').simulate('click')
          expect(wrapper.text()).not.toContain(
            'To copy the history to your clipboard, highlight the table above, click the right button of your mouse, and select "Copy."'
          )
          expect(clipboard.copy).toHaveBeenCalledWith({
            'text/plain': resultsTable.innerText,
            'text/html': resultsTable.outerHTML,
          })
        })
      })
    })

    describe('release two is active', () => {
      beforeEach(() => {
        spyOn(IntakeConfig, 'isFeatureInactive')
        IntakeConfig.isFeatureInactive.and.returnValue(false)
      })

      it("renders 'Add a person...' Copy when no involvements are present", () => {
        const component = shallow(<HistoryCard {...requiredProps}/>)
        expect(component.find('table').length).toEqual(0)
        expect(component.text()).toContain('Search for people and add them to see their child welfare history.')
      })

      it('does not render table when no involvements are present', () => {
        const component = shallow(<HistoryCard {...requiredProps}/>)
        expect(component.find('table').length).toEqual(0)
      })

      it('renders table headings when there are involvements', () => {
        const involvements = Immutable.fromJS({screenings: [{}]})
        const props = {...requiredProps, involvements}
        const component = shallow(<HistoryCard {...props}/>)

        const tr = component.find('thead tr')
        expect(tr.text()).toContain('Date')
        expect(tr.text()).toContain('Type/Status')
        expect(tr.text()).toContain('County/Office')
        expect(tr.text()).toContain('People and Roles')
      })

      it('does not render screenings', () => {
        const involvements = Immutable.fromJS({screenings: [{}]})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const screeningCards = component.find('HistoryCardScreening')
        expect(screeningCards.length).toEqual(0)
      })

      it('renders referrals, if present', () => {
        const involvements = Immutable.fromJS({referrals: [{}]})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const referralCards = component.find('HistoryCardReferral')
        expect(referralCards.length).toEqual(1)
      })

      it('does not render referrals if empty', () => {
        const involvements = Immutable.fromJS({referrals: []})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const referralCards = component.find('HistoryCardReferral')
        expect(referralCards.length).toEqual(0)
      })

      it('renders cases, if present', () => {
        const involvements = Immutable.fromJS({cases: [{}]})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const caseCards = component.find('HistoryCardCase')
        expect(caseCards.length).toEqual(1)
      })

      it('does not render cases if empty', () => {
        const involvements = Immutable.fromJS({cases: []})
        const props = {
          ...requiredProps,
          involvements,
        }
        const component = shallow(<HistoryCard {...props}/>)
        const caseCards = component.find('HistoryCardCase')
        expect(caseCards.length).toEqual(0)
      })

      describe('copy button', () => {
        const involvements = Immutable.fromJS({screenings: [Immutable.fromJS({id: 1})]})
        it('does not render if there are no involvements', () => {
          const component = shallow(<HistoryCard {...requiredProps} />)
          expect(component.find('button[children="Copy"]').length).toEqual(0)
        })
        it('has an onClick callback', () => {
          const component = shallow(<HistoryCard {...requiredProps} involvements={involvements} />)
          const copyButton = component.find('button[children="Copy"]')
          expect(copyButton.props().onClick).toEqual(jasmine.any(Function))
        })
        it('calls the clipboard library', () => {
          spyOn(clipboard, 'copy')
          const wrapper = mount(<HistoryCard {...requiredProps} involvements={involvements} />)
          const resultsTable = wrapper.find('table').node
          wrapper.find('button[children="Copy"]').simulate('click')
          expect(clipboard.copy).toHaveBeenCalledWith({
            'text/plain': resultsTable.innerText,
            'text/html': resultsTable.outerHTML,
          })
        })
      })
    })
  })
})

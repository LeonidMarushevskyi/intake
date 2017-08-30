import {participantFlag} from 'utils/accessIndicator'

describe('participantFlag', () => {
  it('returns undefined when no flags are set', () => {
    expect(participantFlag({})).toEqual(undefined)
  })

  it('returns Sealed when both sealed and sensitive flags are set', () => {
    expect(participantFlag({sealed: true, sensitive: true})).toEqual('Sealed')
  })

  it('returns Sealed when sealed flag is set', () => {
    expect(participantFlag({sensitive: false, sealed: true})).toEqual('Sealed')
  })

  it('returns Sensitive when sensitive flag is set', () => {
    expect(participantFlag({sensitive: true})).toEqual('Sensitive')
  })
})


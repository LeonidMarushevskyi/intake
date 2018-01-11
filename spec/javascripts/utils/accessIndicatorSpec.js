import {participantFlag, accessDescription} from 'utils/accessIndicator'

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

describe('accessDescription', () => {
  it('returns Sealed when accessCode is R', () => {
    expect(accessDescription('R')).toEqual('Sealed')
  })

  it('returns Sensitive when accessCode is S', () => {
    expect(accessDescription('S')).toEqual('Sensitive')
  })

  it('returns undefined when accessCode is neither R nor S', () => {
    expect(accessDescription({})).toEqual(undefined)
  })
})

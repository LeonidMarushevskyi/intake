import 'jquery-helpers'

describe('jquery-helpers', () => {
  it('adds jQuery to the window', () => {
    window.jQuery('body').data('example', 'kitty cats')
    expect(window.jQuery('body').data('example')).toEqual('kitty cats')
  })
})

import * as Hello from 'samples/hello'

describe('samples/hello', () => {
  describe('.sayHello', () => {
    beforeEach(() => spyOn(console, 'log'))

    it('prints a hello message to the console', () => {
      Hello.sayHello('Robert James')
      expect(console.log).toHaveBeenCalledWith('Hello, Robert James!')
    })
  })

  describe('.sayGoodbye', () => {
    beforeEach(() => spyOn(console, 'log'))

    it('prints a goodbye message to the console', () => {
      Hello.sayGoodbye('Jane Adams')
      expect(console.log).toHaveBeenCalledWith('Goodbye, Jane Adams!')
    })
  })
})

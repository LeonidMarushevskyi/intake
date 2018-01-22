var Enzyme = require('enzyme')
var Adapter = require('enzyme-adapter-react-16')
Enzyme.configure({adapter: new Adapter()})

var componentContext = require.context('./../app/javascript', true, /\*\.(js|jsx)$/)
componentContext.keys().forEach(componentContext)

var testsContext = require.context('./javascripts', true, /Spec$/)
testsContext.keys().forEach(testsContext)

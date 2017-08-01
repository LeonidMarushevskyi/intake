var componentContext = require.context('./../app/javascript', true, /\*\.(js|jsx)$/)
componentContext.keys().forEach(componentContext)

var testsContext = require.context('./javascripts', true, /Spec$/)
testsContext.keys().forEach(testsContext)

import {createHistory} from 'history'
import {useRouterHistory} from 'react-router'
import {config} from 'common/config'

// configure, create, and export the project's history instance
export default useRouterHistory(createHistory)({
  basename: config().base_path,
})


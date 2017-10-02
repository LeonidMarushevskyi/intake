import {createHistory} from 'history'
import {useRouterHistory} from 'react-router'
import {config} from 'common/config'

export const routerHistory = useRouterHistory(createHistory)({basename: config().base_path})

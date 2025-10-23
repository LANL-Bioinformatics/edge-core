import React from 'react'
import config from 'src/config'
const SRAWorkflow = React.lazy(() => import('src/workflows/sra/Main'))

const workflowPrivateRoutes = [
  config.APP.SRADATA_IS_ENABLED && { path: '/user/sradata', name: 'Data', element: SRAWorkflow },
]

export default workflowPrivateRoutes

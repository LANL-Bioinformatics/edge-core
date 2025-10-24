import React from 'react'

const Home = React.lazy(() => import('src/workflows/wastewater/home'))

const workflowRoutes = [{ path: '/home', name: 'Home', element: Home }]

export default workflowRoutes

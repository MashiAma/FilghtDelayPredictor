import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import routers from '../routes/routes'


const AppContent = () => {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        {routers.map((router, idx) => {
          return (
            router.element && (
              <Route
                key={idx}
                path={router.path}
                exact={router.exact}
                name={router.name}
                element={<router.element />}
              />
            )
          )
        })}
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default React.memo(AppContent)

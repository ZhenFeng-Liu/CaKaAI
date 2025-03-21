import { usePermissions } from '@renderer/hooks/usePermissions'
import { FC, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

interface AuthRouteProps {
  menuName: string
  children: ReactElement
}

const AuthRoute: FC<AuthRouteProps> = ({ menuName, children }) => {
  const { checkMenuPermission } = usePermissions()

  if (!checkMenuPermission(menuName)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AuthRoute

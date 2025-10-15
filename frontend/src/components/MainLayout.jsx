
import { Outlet } from 'react-router-dom'
import Home from './Home'
import LeftSideBar from './LeftSideBar'

const MainLayout = () => {
  return (<>
    <LeftSideBar />
    <div>
      <Outlet />
    </div>
  </>
  )
}

export default MainLayout

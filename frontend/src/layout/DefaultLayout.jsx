import AppHeader from "../components/AppHeader"
import AppContent from "../components/AppContent"
import { Fragment } from "react"

const DefaultLayout = ({ mode, toggleTheme }) => {
  return (
    <Fragment>
      <div >
        <AppHeader mode={mode} toggleTheme={toggleTheme} />
        <div >
          <AppContent />
        </div>
      </div>
    </Fragment>
  )
}

export default DefaultLayout


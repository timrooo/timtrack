import { useNav } from './hooks/useNav'
import { BottomNav } from './components/layout/BottomNav'
import { HomeScreen } from './screens/Home'
import { ObjectScreen } from './screens/Object'
import { FloorScreen } from './screens/Floor'
import { ConstructionScreen } from './screens/Construction'
import { PartScreen } from './screens/Part'
import { ScannerScreen } from './screens/Scanner'
import { SettingsScreen } from './screens/Settings'
import { LoginScreen } from './screens/Login'
import { Screen } from './types'

export default function App() {
  const nav = useNav({ name: 'home' })
  const screen = nav.current

  const showBottomNav = !['login'].includes(screen.name)

  function handleNavTabClick(target: Screen) {
    if (target.name === 'home') {
      nav.reset({ name: 'home' })
    } else {
      nav.navigate(target)
    }
  }

  return (
    <div className="app-container">
      <ScreenRenderer screen={screen} nav={nav} />
      {showBottomNav && <BottomNav current={screen} onNavigate={handleNavTabClick} />}
    </div>
  )
}

function ScreenRenderer({ screen, nav }: { screen: Screen; nav: ReturnType<typeof useNav> }) {
  switch (screen.name) {
    case 'home':
      return <HomeScreen nav={nav} />
    case 'object':
      return <ObjectScreen nav={nav} projectId={screen.projectId} />
    case 'floor':
      return <FloorScreen nav={nav} floorId={screen.floorId} projectId={screen.projectId} />
    case 'construction':
      return <ConstructionScreen nav={nav} constructionId={screen.constructionId} />
    case 'part':
      return <PartScreen nav={nav} partId={screen.partId} />
    case 'scanner':
      return <ScannerScreen nav={nav} />
    case 'settings':
      return <SettingsScreen nav={nav} />
    case 'login':
      return <LoginScreen nav={nav} />
    default:
      return <HomeScreen nav={nav} />
  }
}

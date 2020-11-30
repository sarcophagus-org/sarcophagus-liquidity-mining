import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className="container min-h-screen flex flex-col justify-between">
      <div>
        <Header />
      </div>
      <Footer />
    </div>
  )
}

export default App

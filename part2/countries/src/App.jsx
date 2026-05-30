import { useEffect, useMemo, useState } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import { getAll } from './services/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAll().then(setCountries)
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelected(null)
  }

  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase()
    if (!query) return []
    return countries.filter((country) =>
      country.name.common.toLowerCase().includes(query)
    )
  }, [countries, filter])

  const displayed = selected ? [selected] : filtered

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange} />
      <Countries countries={displayed} onShow={setSelected} />
    </div>
  )
}

export default App

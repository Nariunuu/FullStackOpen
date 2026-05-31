import { useFilter, useFilterActions } from '../store'

const Filter = () => {
  const filter = useFilter()
  const { setFilter } = useFilterActions()

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input
        value={filter}
        placeholder="filter"
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  )
}

export default Filter

const Filter = ({ filter, setFilter }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label>filter shown with</label>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  )
}

export default Filter
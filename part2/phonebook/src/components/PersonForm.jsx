const PersonForm = ({ newPerson, setNewPerson, addPerson }) => {
  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault()
        addPerson(newPerson)
        setNewPerson({ name: '', number: '' })
      }}>
        <div>
          <label>name:</label>
          <input value={newPerson.name} onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })} />
        </div>
        <div>
          <label>number:</label>
          <input required value={newPerson.number} onChange={(e) => setNewPerson({ ...newPerson, number: e.target.value })} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm
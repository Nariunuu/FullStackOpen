import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import usePersons from './hooks/usePersons'
import { useMemo } from 'react'
import Notifications from './components/Notifications'

const App = () => {
  const [newPerson, setNewPerson] = useState({})
  const [filter, setFilter] = useState('')

  const { persons, addPerson, deletePerson, notification } = usePersons()

  const filteredPersons = useMemo(
    () =>
      persons.filter(({ name }) =>
        name.trim().length > 0
          ? name.toLowerCase().includes(filter.toLowerCase())
          : true,
      ),
    [persons, filter],
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notifications message={notification?.message} status={notification?.status} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new person</h3>
      <PersonForm newPerson={newPerson} setNewPerson={setNewPerson} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
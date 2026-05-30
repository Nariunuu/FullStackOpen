const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.number}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></div>
      ))}
    </div>
  )
}

export default Persons
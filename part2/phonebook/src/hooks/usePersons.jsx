import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const usePersons = () => {
  const [persons, setPersons] = useState([]);
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    axios.get("http://localhost:3005/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const addPerson = async (person) => {
    if (persons.some(({ name }) => name === person.name)) {
      const existingPerson = persons.find(({ name }) => name === person.name);
      console.log(existingPerson);
      if (existingPerson && confirm(`${person.name} is already in the phonebook, do you want to update the number?`)) {
        await updatePerson({ ...existingPerson, number: person.number });
        return;
      }
      return;
    }
    try {
      axios.post("http://localhost:3005/persons", person).then((response) => {
        setPersons(persons.concat(response.data));
      });
      setNotification({ message: `${person.name} added`, status: 'success' });
    } catch (error) {
      setNotification({ message: `Failed to add ${person.name}: ${error.message}`, status: 'error' });
    }
  };

  const deletePerson = async (id) => {
    try {
      axios.delete(`http://localhost:3005/persons/${id}`).then((response) => {
        setPersons(persons.filter(({ id: personId }) => personId !== response.data.id));
      });
      setNotification({ message: `Person deleted`, status: 'success' });
    } catch (error) {
      setNotification({ message: `Failed to delete person: ${error.message}`, status: 'error' });
    }
  };

  const updatePerson = async (person) => {
    try {
      const response = await axios.put(`http://localhost:3005/persons/${person.id}`, person);
      setPersons(persons.map((p) => p.id === response.data.id ? response.data : p));
      setNotification({ message: `Person updated`, status: 'success' });
    } catch (error) {
      setNotification({ message: `Person ${person.name} might already be deleted: ${error.message}`, status: 'error' });
      setPersons(persons.filter(({ id: personId }) => personId !== person.id));
    }
  };

  return { persons, addPerson, deletePerson, updatePerson, notification };
};

export default usePersons;

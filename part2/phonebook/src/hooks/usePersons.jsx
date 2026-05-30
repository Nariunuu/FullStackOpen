import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const baseUrl = import.meta.env.VITE_SERVER_URL;

const usePersons = () => {
  const [persons, setPersons] = useState([]);
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    axios.get(baseUrl).then((response) => {
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
      const response = await axios.post(baseUrl, person);
      setPersons(persons.concat(response.data));
      setNotification({ message: `${person.name} added`, status: 'success' });
    } catch (error) {
      setNotification({ message: `Failed to add ${person.name}: ${error.message}`, status: 'error' });
    }
  };

  const deletePerson = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setPersons(persons.filter(({ id: personId }) => personId !== id));
      setNotification({ message: `Person deleted`, status: 'success' });
    } catch (error) {
      setNotification({ message: `Failed to delete person: ${error.message}`, status: 'error' });
    }
  };

  const updatePerson = async (person) => {
    try {
      const response = await axios.put(`${baseUrl}/${person.id}`, person);
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

import Weather from './Weather'

const Country = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital?.[0]}</p>
    <p>area {country.area}</p>

    <h3>languages</h3>
    <ul>
      {Object.values(country.languages ?? {}).map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>

    <img
      src={country.flags.png}
      alt={country.flags.alt ?? `Flag of ${country.name.common}`}
      width="150"
    />

    {country.capital?.[0] && (
      <Weather key={country.capital[0]} city={country.capital[0]} />
    )}
  </div>
)

export default Country

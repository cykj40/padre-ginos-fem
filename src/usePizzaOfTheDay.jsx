import { useState, useEffect, useDebugValue } from "react";
import { fetchApi } from './api/config';

export const usePizzaOfTheDay = () => {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);
  const [error, setError] = useState(null);

  useDebugValue(pizzaOfTheDay ? `${pizzaOfTheDay.name}` : "Loading...");

  useEffect(() => {
    async function fetchPizzaOfTheDay() {
      try {
        const data = await fetchApi('api/pizza-of-the-day');
        setPizzaOfTheDay(data);
      } catch (err) {
        console.error('Error fetching pizza of the day:', err);
        setError(err.message);
      }
    }

    fetchPizzaOfTheDay();
  }, []);

  if (error) {
    throw new Error(`Failed to load pizza of the day: ${error}`);
  }

  return pizzaOfTheDay;
};
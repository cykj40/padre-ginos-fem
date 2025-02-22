import { usePizzaOfTheDay } from "./usePizzaOfTheDay";
import { getImageUrl } from './api/config';

// feel free to change en-US / USD to your locale
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PizzaOfTheDay = () => {
  const pizzaOfTheDay = usePizzaOfTheDay();

  if (!pizzaOfTheDay) {
    return (
      <div className="pizza-of-the-day">
        <h2>Pizza of the Day</h2>
        <div className="loading">Loading today's special...</div>
      </div>
    );
  }

  return (
    <div className="pizza-of-the-day">
      <h2>Pizza of the Day</h2>
      <div>
        <div className="pizza-of-the-day-info">
          <h3>{pizzaOfTheDay.name}</h3>
          <p>{pizzaOfTheDay.description}</p>
          {pizzaOfTheDay.sizes && (
            <p className="pizza-of-the-day-price">
              From: <span>{intl.format(pizzaOfTheDay.sizes.S)}</span>
            </p>
          )}
        </div>
        {pizzaOfTheDay.image && (
          <img
            className="pizza-of-the-day-image"
            src={getImageUrl(pizzaOfTheDay.image)}
            alt={pizzaOfTheDay.name}
          />
        )}
      </div>
    </div>
  );
};

export default PizzaOfTheDay;
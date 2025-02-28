import { usePizzaOfTheDay } from "./usePizzaOfTheDay";

// feel free to change en-US / USD to your locale
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PizzaOfTheDay = () => {
  const pizzaOfTheDay = usePizzaOfTheDay();

  if (!pizzaOfTheDay) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pizza-of-the-day" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Pizza of the Day</h2>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
        <div className="pizza-of-the-day-info" style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{pizzaOfTheDay.name}</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{pizzaOfTheDay.description}</p>
          <p className="pizza-of-the-day-price" style={{ fontWeight: 'bold' }}>
            From: <span>{intl.format(pizzaOfTheDay.sizes.S)}</span>
          </p>
        </div>
        <img
          className="pizza-of-the-day-image"
          src={pizzaOfTheDay.image}
          alt={pizzaOfTheDay.name}
          style={{ maxWidth: '150px', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
};

export default PizzaOfTheDay;
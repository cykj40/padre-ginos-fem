const Pizza = (props) => {
  return (
    <div className="pizza">
      <h1>{props.name}</h1>
      <p>{props.description}</p>
      <img
        src={`${import.meta.env.VITE_API_URL}${props.image}`}
        alt={props.name} />
    </div>
  );
};

export default Pizza;
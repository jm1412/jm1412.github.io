function Button() {
  const handleClick = () => console.log("OUCH!");

  const handleClick3 = (name) => console.log(`${name} stop clicking me`)

  function handleClick2(name) {
    console.log(`${name} stop clicking me`);
  }

  return (
    <button onClick={()=>handleClick2("juan")} className="button">
      Click Me
    </button>
  );
}

export default Button;

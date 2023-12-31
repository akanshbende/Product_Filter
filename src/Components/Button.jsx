function Button({ title, setItem, item }) {
  return (
    <>
      <button
        className="buttonAll bg-black text-white font-bold text-sm rounded-lg p-2 m-1   align-middle text-center "
        onClick={() => {
          setItem(item);
        }}
      >
        {title}
      </button>
    </>
  );
}

export default Button;

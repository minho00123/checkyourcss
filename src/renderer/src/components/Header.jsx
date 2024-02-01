import cycImage from "../../../../resources/cyc.png";

function Header() {
  return (
    <header className="flex justify-center p-8 border-b-2 shadow-md">
      <img
        src={cycImage}
        alt="cyc logo"
        className="absolute -top-11 left-5 w-48"
      />
      <h1 className="text-4xl font-bold drop-shadow-2xl">Check Your CSS</h1>
    </header>
  );
}

export default Header;

import Link from "next/link";

function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        {/* Logo */}
        <Link href="/">
          <img
            src="https://links.papareact.com/yvf"
            alt=""
            className="object-contain w-44 cursor-pointer"
          />
        </Link>
        {/* Links */}
        <div className="hidden md:inline-flex items-center space-x-5">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="text-white bg-green-600 px-4  py-1 rounded-full">
            Follow
          </h3>
        </div>
      </div>

      {/* Login and sign up */}
      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="border px-4 py-1 rounded-full border-green-600">
          Get started
        </h3>
      </div>
    </header>
  );
}

export default Header;

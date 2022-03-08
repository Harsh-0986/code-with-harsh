import Link from "next/link";

function Header() {

  const blog_name="<Code with harsh />"

  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto bg-[#F7F7F7]" >
      <div className="flex items-center space-x-5 mx-auto lg:mx-0">
        
        {/* Logo */}
        <Link href="/">
          {/* <h2 className="text-2xl blog_name bg-blue-200 p-5 rounded-full">{blog_name}</h2> */}
          <img
            src="https://raw.githubusercontent.com/Harsh-0986/code-with-harsh/main/public/logo.PNG"
            alt=""
            className="object-contain w-44 cursor-pointer "
            />
        </Link>
        {/* Links */}
        <div className="hidden md:inline-flex items-center space-x-5">
          <h3 className="text-xl">About</h3>
          <h3 className="text-xl">Contact</h3>
          <h3 className="text-xl text-white bg-green-600 px-4  py-1 rounded-full">
            Follow
          </h3>
        </div>
      </div>

      {/* Login and sign up */}
      <div className="hidden md:flex items-center space-x-5 text-green-600">
        <h3 className="text-xl">Sign In</h3>
        <h3 className="text-xl border px-4 py-1 rounded-full border-green-600 sm:text-sm">
          Get started
        </h3>
      </div>
    </header>
  );
}

export default Header;

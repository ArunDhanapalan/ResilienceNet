const Header = ({ user}) => {
  return (
    <header className="rounded-lg backdrop-blur-sm text-black p-4 flex justify-between items-center shadow-md">
      {/* Left section: Logo and App Name */}
      <div className="flex items-center space-x-2">
        <span className="text-xl">🛣️</span>
        <span className="text-2xl font-bold text-amber-700">CivicPulse</span>
      </div>

      {/* Right section: User Info */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-md font-semibold">Hi, {user?.username || "User"}</p>
          <p className="text-sm text-gray-500">
            {user?.role||"Please login"} | {"Chennai"}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
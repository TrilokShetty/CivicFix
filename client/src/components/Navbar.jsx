import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Menu, X, Hammer, MapPin, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all duration-300">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white group-hover:bg-indigo-700 transition">
                        <Hammer size={24} />
                    </div>
                    <span className="self-center text-2xl font-bold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        CivicFix
                    </span>
                </Link>

                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block font-medium text-gray-700">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all shadow-md hover:shadow-lg">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all shadow-md hover:shadow-lg">
                                Login
                            </Link>
                            <Link to="/signup" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:ring-4 focus:outline-none focus:ring-indigo-200 font-medium rounded-lg text-sm px-4 py-2 text-center border border-indigo-200 transition-all">
                                Sign Up
                            </Link>
                        </div>
                    )}
                    <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        {user && (
                            <>
                                <li>
                                    <Link to="/report" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-indigo-700 md:p-0">New Report</Link>
                                </li>
                                <li>
                                    <Link to="/dashboard" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-indigo-700 md:p-0">My Reports</Link>
                                </li>
                                {(user.role === 'department_head' || user.role === 'admin') && (
                                    <li>
                                        <Link to="/admin" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-indigo-700 md:p-0">Dept Dashboard</Link>
                                    </li>
                                )}
                            </>
                        )}
                        {!user && (
                            <li>
                                <Link to="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-indigo-700 md:p-0">Home</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

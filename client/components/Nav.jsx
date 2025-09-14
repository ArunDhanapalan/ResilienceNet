'use client';

import { LogOut } from 'lucide-react';

const Nav = ({ user, setView, logout }) => {
    return (
        <nav className="w-full max-w-4xl p-4 flex justify-between items-center bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
            <h1 className="text-2xl font-bold text-gray-800">CivicPulse</h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user.email}</span>
                <button
                    onClick={logout}
                    className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition duration-200"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </nav>
    );
};

export default Nav;

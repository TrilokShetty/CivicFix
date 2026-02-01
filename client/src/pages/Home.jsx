import { Link } from 'react-router-dom';
import { Hammer, CheckCircle, Shield } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-indigo-900 text-white pb-20 pt-32">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 opacity-90"></div>
                </div>

                <div className="relative z-10 max-w-screen-xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
                        Fixing Our Community <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Together.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10 animate-fade-in delay-100">
                        CivicFix uses AI to streamline public amenity reporting. Snap a picture, drop a pin, and let us handle the rest.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in delay-200">
                        <Link to="/report" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-lg shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-1">
                            Report an Issue
                        </Link>
                        <Link to="/signup" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold rounded-xl text-lg border border-white/20 transition">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-screen-xl mx-auto px-4 py-20">
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
                        <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                            <Hammer size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Report Instantly</h3>
                        <p className="text-gray-500">No forms to fill. Just type a description and our AI figures out the category and department.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
                        <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                            <CheckCircle size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Track Progress</h3>
                        <p className="text-gray-500">Get real-time updates on your reports from "Submitted" to "Resolved".</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
                        <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                            <Shield size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Community Safety</h3>
                        <p className="text-gray-500">Improve safety on campus and in the city by ensuring hazards are fixed quickly.</p>
                    </div>
                </div>
            </div>

            <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500">
                <p>&copy; 2024 CivicFix. Built for IIT Tirupati NSS.</p>
            </footer>
        </div>
    );
};

export default Home;

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { MapPin, User, Search } from 'lucide-react';

const DeptDashboard = () => {
    const [reports, setReports] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/api/reports/department', {
                    headers: { 'x-auth-token': token }
                });
                setReports(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="pt-24 pb-10 min-h-screen bg-gray-50 px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Department Dashboard</h2>
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full text-sm border border-emerald-100">
                            {user?.department} Department
                        </span>
                    </div>
                    <div className="flex gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <Search size={16} /> Total Reports: {reports.length}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Reporter</th>
                                    <th className="px-6 py-4">Evidence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map(report => (
                                    <tr key={report._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-400">
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{report.category}</td>
                                        <td className="px-6 py-4 truncate max-w-xs" title={report.description}>{report.description}</td>
                                        <td className="px-6 py-4 flex items-center gap-1">
                                            <MapPin size={14} className="text-gray-400" /> Lat: {report.location.lat.toFixed(4)}...
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-gray-400" />
                                                {report.user?.name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {report.photoUrl ? (
                                                <a href={`http://localhost:5000${report.photoUrl}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                                                    View Photo
                                                </a>
                                            ) : <span className="text-gray-400">N/A</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {reports.length === 0 && (
                        <div className="text-center py-10 text-gray-400">No reports found for this department.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeptDashboard;

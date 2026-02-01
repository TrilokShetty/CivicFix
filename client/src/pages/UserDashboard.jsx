import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Clock, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

const UserDashboard = () => {
    const [reports, setReports] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/api/reports/my', {
                    headers: { 'x-auth-token': token }
                });
                setReports(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReports();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
            case 'In Progress': return 'text-amber-500 bg-amber-50 border-amber-200';
            default: return 'text-blue-500 bg-blue-50 border-blue-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle size={16} />;
            case 'In Progress': return <Clock size={16} />;
            default: return <AlertTriangle size={16} />;
        }
    };

    return (
        <div className="pt-24 pb-10 min-h-screen max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">My Reports</h2>

            {reports.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow border border-gray-100">
                    <p className="text-gray-500 text-lg">You haven't submitted any reports yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {reports.map(report => (
                        <div key={report._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className="flex h-40">
                                {report.photoUrl ? (
                                    <img src={`http://localhost:5000${report.photoUrl}`} alt="Evidence" className="w-1/3 object-cover" />
                                ) : (
                                    <div className="w-1/3 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{report.category}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(report.status)}`}>
                                                {getStatusIcon(report.status)} {report.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 font-medium line-clamp-2">{report.description}</p>
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                                        <MapPin size={14} /> {new Date(report.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;

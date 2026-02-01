import { useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Send, Loader2 } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ setPosition, position }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const Report = () => {
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const { user } = useContext(AuthContext);
    const [aiState, setAiState] = useState('idle'); // 'idle', 'thinking', 'result'
    const [logs, setLogs] = useState([]);
    const [classification, setClassification] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !position) {
            alert('Please provide a description and a location on the map.');
            return;
        }

        setAiState('thinking');
        setLogs([]);

        // Animated logs simulation
        const logMessages = [
            "Initializing Neural Network...",
            "Tokenizing Input String...",
            "Analyzing Semantic Context...",
            "Routing to Department..."
        ];

        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < logMessages.length) {
                setLogs(prev => [...prev, logMessages[logIndex]]);
                logIndex++;
            }
        }, 500);

        const startTime = Date.now();

        const formData = new FormData();
        formData.append('description', description);
        formData.append('lat', position.lat);
        formData.append('lng', position.lng);
        formData.append('address', `Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`);
        if (file) {
            formData.append('image', file);
        }

        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/reports`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });

            const elapsedTime = Date.now() - startTime;
            // Ensure at least 2 seconds of animation
            const remainingTime = Math.max(0, 2500 - elapsedTime);

            setTimeout(() => {
                clearInterval(logInterval);
                setClassification(res.data.category || res.data.department || 'General');
                setAiState('result');
            }, remainingTime);

        } catch (err) {
            console.error(err);
            alert('Failed to submit report');
            setAiState('idle');
            clearInterval(logInterval);
        }
    };

    return (
        <div className="pt-20 pb-10 min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 bg-indigo-600 text-white">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <MapPin className="text-accent" /> New Issue Report
                    </h1>
                    <p className="opacity-80 mt-2">Help us fix our community. Spot it, Click it, Fix it.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Left: Map */}
                    <div className="h-96 md:h-auto bg-gray-100 relative">
                        <MapContainer center={[13.6288, 79.4192]} zoom={13} scrollWheelZoom={false} className="h-full w-full z-0">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker setPosition={setPosition} position={position} />
                        </MapContainer>
                        <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow text-sm text-gray-600 z-[400] text-center border border-gray-200">
                            Tap on the map to pinpoint the issue location
                        </div>
                    </div>

                    {/* Right: Form or AI View */}
                    <div className={`relative transition-all duration-500 ease-in-out ${aiState !== 'idle' ? 'bg-gray-900 text-white' : ''}`}>
                        {aiState === 'idle' ? (
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Describe the Issue</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="E.g., Streetlight flickering on Main St..."
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32 resize-none transition"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo (Optional)</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden">
                                            {preview ? (
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500">Click to upload image</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transform transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:-translate-y-1 hover:shadow-indigo-500/30"
                                >
                                    <Send size={20} /> Submit Report
                                </button>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center h-full w-full">
                                {aiState === 'thinking' && (
                                    <div className="flex flex-col items-center animate-fade-in w-full">
                                        <div className="ai-orb mb-8 transform scale-75 md:scale-100"><div className="ai-orb-core"></div></div>
                                        <div className="w-full max-w-xs text-left font-mono text-sm space-y-2 h-32">
                                            {logs.map((log, i) => (
                                                <div key={i} className="terminal-text animate-slide-up">{'>'} {log}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {aiState === 'result' && (
                                    <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">
                                        <div className="scanline-wipe"></div>
                                        <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700 w-full animate-scale-up">
                                            <h2 className="text-gray-400 text-sm font-mono uppercase tracking-widest mb-2">Classification Complete</h2>
                                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4 drop-shadow-sm uppercase">
                                                {classification}
                                            </div>
                                            <p className="text-gray-300 text-sm mb-6">Your report has been automatically routed to the correct department based on semantic analysis.</p>

                                            <button
                                                onClick={() => navigate('/dashboard')}
                                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all text-white flex items-center justify-center gap-2"
                                            >
                                                View Status <Send size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Report;

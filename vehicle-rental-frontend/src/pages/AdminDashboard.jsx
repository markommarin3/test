import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:8000/api/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);

                // Fetch current discount
                const discountRes = await axios.get('http://localhost:8000/api/discounts/current');
                if (discountRes.data.active) {
                    setActiveDiscount(discountRes.data.discount);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:8000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsersList(res.data.data || []);
            setShowUsersModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl font-black text-blue-600 animate-bounce">Učitavanje podataka...</div>
        </div>
    );

    if (!stats) return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="bg-red-50 border-2 border-red-100 p-12 rounded-3xl">
                <span className="text-6xl mb-6 block">🚫</span>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Pristup Odbijen</h2>
                <p className="text-gray-500 font-medium mb-8">
                    Nemate dozvolu za ovaj modul ili vam je sesija istekla. <br />
                    Molimo vas da se **odjavite i ponovo prijavite** kako biste osvežili pristupne podatke.
                </p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg"
                >
                    Idi na Prijavu
                </button>
            </div>
        </div>
    );

    const cards = [
        {
            label: 'Ukupno Vozila',
            val: stats.total_vehicles,
            color: 'bg-blue-600',
            icon: '🚗',
            action: () => navigate('/upravljanje-vozilima')
        },
        {
            label: 'Korisnici',
            val: stats.total_users,
            color: 'bg-indigo-600',
            icon: '👥',
            action: fetchUsers
        },
        {
            label: 'Rezervacije',
            val: stats.total_reservations,
            color: 'bg-purple-600',
            icon: '📅',
            action: () => navigate('/upravljanje')
        },
        {
            label: 'Popusti',
            val: activeDiscount ? `${activeDiscount.procenat}%` : 'Nema',
            color: activeDiscount ? 'bg-orange-600' : 'bg-gray-400',
            icon: '💸',
            action: () => navigate('/admin/popusti')
        },
        {
            label: 'Ukupan Prihod',
            val: `${stats.total_revenue} €`,
            color: 'bg-green-600',
            icon: '💰',
            action: () => setShowRevenueModal(true)
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-10">Admin Dashboard</h1>

            {/* Stats Grid - Updated to 5 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {cards.map((item, i) => (
                    <div
                        key={i}
                        onClick={item.action}
                        className={`${item.color} p-8 rounded-3xl text-white shadow-xl transform transition-all cursor-pointer hover:scale-105 hover:shadow-2xl active:scale-95`}
                    >
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <p className="opacity-80 font-bold uppercase text-xs tracking-wider mb-2">{item.label}</p>
                        <p className="text-3xl font-black">{item.val}</p>
                        <div className="mt-4 flex items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                            Prikaži detalje →
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Reservations Table */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h2 className="text-2xl font-black text-gray-800">Poslednje rezervacije</h2>
                    <button onClick={() => navigate('/upravljanje')} className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">Vidi sve</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4 text-left">Korisnik</th>
                                <th className="px-8 py-4 text-left">Vozilo</th>
                                <th className="px-8 py-4 text-left">Period</th>
                                <th className="px-8 py-4 text-left">Status</th>
                                <th className="px-8 py-4 text-left">Iznos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.latest_reservations.map(res => (
                                <tr key={res.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-8 py-6 font-black text-gray-900 group-hover:text-blue-600 transition-colors">{res.korisnik?.ime}</td>
                                    <td className="px-8 py-6 text-gray-600 font-bold">{res.vozilo?.marka} <span className="text-gray-400">{res.vozilo?.model}</span></td>
                                    <td className="px-8 py-6 text-xs text-gray-500 font-medium">
                                        {new Date(res.vremePreuzimanja).toLocaleDateString()} - {new Date(res.vremeVracanja).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${res.status === 'OTKAZANA' ? 'bg-red-50 text-red-600' :
                                            res.status === 'ZAVRSENA' ? 'bg-green-50 text-green-600' :
                                                'bg-yellow-50 text-yellow-600'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-gray-900 group-hover:text-green-600 transition-colors">{res.ukupnaCena} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Users Modal */}
            {showUsersModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-gray-900">Korisnici</h2>
                            <button onClick={() => setShowUsersModal(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">✕</button>
                        </div>
                        <div className="space-y-4">
                            {usersList.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black">
                                            {u.ime.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{u.ime}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-100 text-gray-400">
                                        {u.uloga}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Revenue Modal (Simple visualization) */}
            {showRevenueModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">💰</div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Ukupan Prihod</h2>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-8">Pregled finansija</p>

                        <div className="text-6xl font-black text-green-600 tracking-tighter mb-8">
                            {stats.total_revenue} €
                        </div>

                        <p className="text-sm text-gray-500 font-medium bg-gray-50 p-6 rounded-2xl mb-8">
                            Ovaj iznos predstavlja ukupan zbir svih rezervacija koje nisu otkazane.
                            U budućim verzijama ovde će biti prikazan grafikon prihoda po mesecima.
                        </p>

                        <button
                            onClick={() => setShowRevenueModal(false)}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-colors"
                        >
                            Zatvori
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

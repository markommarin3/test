import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import ReservationEditModal from '../components/ReservationEditModal';

const StaffReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    // State za modal
    const [activeModal, setActiveModal] = useState(null); // { id, type: 'PREUZETO' | 'VRACENO' }
    const [operationalData, setOperationalData] = useState({
        km: '',
        gorivo: 100
    });
    const [editingReservation, setEditingReservation] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:8000/api/reservations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(res.data.data || []);
        } catch (err) {
            console.error('Error fetching reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus, extraData = {}) => {
        const token = localStorage.getItem('token');
        setMessage({ text: '', type: '' });
        try {
            await axios.put(`http://localhost:8000/api/reservations/${id}`,
                { status: newStatus, ...extraData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ text: `Rezervacija uspešno ažurirana u: ${newStatus}`, type: 'success' });
            setActiveModal(null);
            setOperationalData({ km: '', gorivo: 100 });
            fetchReservations();
        } catch (err) {
            setMessage({ text: 'Greška pri ažuriranju statusa.', type: 'error' });
        }
    };

    // State za štetu
    const [damageModal, setDamageModal] = useState(null); // { id }
    const [damageData, setDamageData] = useState({ opis: '', trosak: 0 });

    const openModal = (id, type) => {
        setActiveModal({ id, type });
        setOperationalData({ km: '', gorivo: 100 });
        setDamageData({ opis: '', trosak: 0 });
    };

    const handleReportDamage = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8000/api/damage-reports', {
                rezervacijaId: damageModal.id,
                opisStete: damageData.opis,
                dodatniTrosak: damageData.trosak
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Izveštaj o šteti uspešno sačuvan.', type: 'success' });
            setDamageModal(null);
            setDamageData({ opis: '', trosak: 0 });
        } catch (err) {
            setMessage({ text: 'Greška pri čuvanju izveštaja o šteti.', type: 'error' });
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-400 animate-pulse text-2xl tracking-tighter">UČITAVANJE OPERATIVNIH PODATAKA...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Operativni Rad</h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Upravljanje vozilima i rezervacijama
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dokumenti')}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-purple-100 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <span className="text-lg">📄</span>
                        Dokumenti
                    </button>
                    {message.text && (
                        <div className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Vozilo / Klijent</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Lokacija / Vreme</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Tehnički podaci</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Akcije</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reservations.map(res => (
                                <tr key={res.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3 text-xl">
                                                🚗
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-none mb-1">{res.vozilo?.marka} {res.vozilo?.model}</p>
                                                <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">{res.korisnik?.ime}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-gray-700">{res.filijala_preuzimanja?.grad} → {res.filijala_vracanja?.grad}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(res.vremePreuzimanja).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        {res.status === 'PREUZETO' || res.status === 'VRACENO' || res.status === 'ZAVRSENA' ? (
                                            <div className="text-[10px] space-y-1">
                                                <p className="font-bold text-gray-600">KM: <span className="text-blue-600">{res.kmPreuzimanje || '-'} / {res.kmVracanje || '-'}</span></p>
                                                <p className="font-bold text-gray-600">GORIVO: <span className="text-blue-600">{res.gorivoPreuzimanje || '-'}% / {res.gorivoVracanje || '-'}%</span></p>

                                                <div className="mt-2 pt-1 border-t border-gray-100">
                                                    <p className="font-bold text-gray-600">
                                                        OŠTEĆENO:
                                                        {res.izvestaji_o_steti && res.izvestaji_o_steti.length > 0 ? (
                                                            <span className="text-red-600 ml-1">
                                                                DA ({res.izvestaji_o_steti.reduce((acc, curr) => acc + parseFloat(curr.dodatniTrosak), 0).toFixed(2)} €)
                                                            </span>
                                                        ) : (
                                                            <span className="text-green-600 ml-1">NE</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-300 italic">Podaci nisu uneti</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest ${res.status === 'CEKA' ? 'bg-yellow-100 text-yellow-700' :
                                            res.status === 'POTVRDJENA' ? 'bg-blue-100 text-blue-700' :
                                                res.status === 'PREUZETO' ? 'bg-indigo-100 text-indigo-700' :
                                                    res.status === 'VRACENO' || res.status === 'ZAVRSENA' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-500'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right space-x-2">
                                        {res.status === 'CEKA' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(res.id, 'POTVRDJENA')}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                                                >
                                                    Potvrdi
                                                </button>
                                                <button
                                                    onClick={() => setEditingReservation(res)}
                                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-200 transition-all ml-2"
                                                >
                                                    Izmeni
                                                </button>
                                            </>
                                        )}
                                        {res.status === 'POTVRDJENA' && (
                                            <button
                                                onClick={() => openModal(res.id, 'ZAVRSENA')}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition-all ml-2"
                                            >
                                                Završi
                                            </button>
                                        )}
                                        {res.status === 'PREUZETO' && (
                                            <button
                                                onClick={() => openModal(res.id, 'ZAVRSENA')}
                                                className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                                            >
                                                Završi
                                            </button>
                                        )}
                                        {res.status !== 'OTKAZANA' && res.status !== 'ZAVRSENA' && (
                                            <button
                                                onClick={() => handleUpdateStatus(res.id, 'OTKAZANA')}
                                                className="text-gray-300 hover:text-red-500 transition-colors text-[10px] font-bold"
                                            >
                                                Otkaži
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal za operativne podatke i završetak */}
            {activeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">
                            {activeModal.type === 'ZAVRSENA' ? 'Završetak Najma' : 'Registracija stanja'}
                        </h2>
                        <p className="text-gray-500 text-sm font-bold mb-8 uppercase tracking-widest">
                            {activeModal.type === 'ZAVRSENA' ? 'Unos završnih parametara i štete' : `Registracija: ${activeModal.type}`}
                        </p>

                        <div className="space-y-6">
                            <Input
                                label="Kilometraža (km)"
                                type="number"
                                value={operationalData.km}
                                onChange={(e) => setOperationalData({ ...operationalData, km: e.target.value })}
                                placeholder="Unesite trenutnu km..."
                            />
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-2">Gorivo (%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="10"
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 border border-gray-300 shadow-inner"
                                    value={operationalData.gorivo}
                                    onChange={(e) => setOperationalData({ ...operationalData, gorivo: e.target.value })}
                                />
                                <div className="flex justify-between mt-2 text-[10px] font-bold text-blue-600">
                                    <span>Prazno</span>
                                    <span>{operationalData.gorivo}%</span>
                                    <span>Pun rezervoar</span>
                                </div>
                            </div>

                            {/* Sekcija za štetu - samo ako se završava najam */}
                            {activeModal.type === 'ZAVRSENA' && (
                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-black text-gray-900 mb-4">Prijava Štete (Opciono)</h3>
                                    <div className="space-y-4">
                                        <Input
                                            label="Opis oštećenja"
                                            value={damageData.opis}
                                            onChange={(e) => setDamageData({ ...damageData, opis: e.target.value })}
                                            placeholder="Npr. Ogrebotina na braniku..."
                                        />
                                        <Input
                                            label="Dodatni trošak (€)"
                                            type="number"
                                            value={damageData.trosak}
                                            onChange={(e) => setDamageData({ ...damageData, trosak: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <Button variant="secondary" onClick={() => { setActiveModal(null); setDamageData({ opis: '', trosak: 0 }); }}>Odustani</Button>
                            <Button
                                variant="primary"
                                onClick={async () => {
                                    const token = localStorage.getItem('token');

                                    // 1. Ako ima štete, prvo sačuvaj to
                                    if (activeModal.type === 'ZAVRSENA' && damageData.opis) {
                                        try {
                                            await axios.post('http://localhost:8000/api/damage-reports', {
                                                rezervacijaId: activeModal.id,
                                                opisStete: damageData.opis,
                                                dodatniTrosak: damageData.trosak || 0
                                            }, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                        } catch (err) {
                                            console.error("Greška pri čuvanju štete", err);
                                            setMessage({ text: 'Greška pri čuvanju štete, ali nastavljam...', type: 'error' });
                                        }
                                    }

                                    // 2. Ažuriraj rezervaciju
                                    const updateFieldKm = activeModal.type === 'PREUZETO' ? 'kmPreuzimanje' : 'kmVracanje';
                                    const updateFieldFuel = activeModal.type === 'PREUZETO' ? 'gorivoPreuzimanje' : 'gorivoVracanje';

                                    handleUpdateStatus(activeModal.id, activeModal.type, {
                                        [updateFieldKm]: operationalData.km,
                                        [updateFieldFuel]: operationalData.gorivo
                                    });

                                    setDamageData({ opis: '', trosak: 0 });
                                }}
                            >
                                {activeModal.type === 'ZAVRSENA' ? 'Završi Najam' : 'Sačuvaj'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}



            {editingReservation && (
                <ReservationEditModal
                    reservation={editingReservation}
                    onClose={() => setEditingReservation(null)}
                    onSave={() => {
                        fetchReservations();
                        setMessage({ text: 'Rezervacija uspešno izmenjena.', type: 'success' });
                        setEditingReservation(null);
                    }}
                />
            )}
        </div>
    );
};

export default StaffReservationsPage;

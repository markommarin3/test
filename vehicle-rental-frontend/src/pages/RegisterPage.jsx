import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8000/api/register', {
                ime: name,
                email,
                telefon: phone,
                sifra: password,
                sifra_confirmation: passwordConfirmation
            });
            // Nakon uspešne registracije, šaljemo na login
            navigate('/login', { state: { message: 'Uspešno ste se registrovali! Prijavite se.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Greška prilikom registracije. Proverite podatke.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">

                {/* Info Side */}
                <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center">
                    <h2 className="text-4xl font-black mb-6 tracking-tight">PRIDRUŽI SE <br /> NAŠOJ MREŽI.</h2>
                    <p className="text-blue-100 text-lg font-medium mb-8 leading-relaxed">
                        Registracijom dobijate pristup ekskluzivnim vozilima, bržem procesu rezervacije i personalizovanoj podršci 24/7.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <span className="bg-blue-500 p-2 rounded-lg text-xl">🚗</span>
                            <span className="font-bold">Preko 50 premium vozila</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-blue-500 p-2 rounded-lg text-xl">🛡️</span>
                            <span className="font-bold">Potpuno osiguranje uključeno</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-blue-500 p-2 rounded-lg text-xl">🎁</span>
                            <span className="font-bold">Popusti za stalne klijente</span>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 p-12 md:p-16">
                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Napravi Nalog</h3>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Započni svoje putovanje danas</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Puno Ime"
                            type="text"
                            placeholder="Zoran Petrović"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label="Email Adresa"
                            type="email"
                            placeholder="zoran@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Broj Telefona"
                            type="tel"
                            placeholder="+381 6..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Lozinka"
                                type="password"
                                placeholder="Najmanje 8 karaktera"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Input
                                label="Potvrdi Lozinku"
                                type="password"
                                placeholder="Ponovite lozinku"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 text-lg font-black shadow-xl shadow-blue-100"
                                disabled={loading}
                            >
                                {loading ? 'Kreiranje...' : 'Registruj se'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Već imaš nalog?{' '}
                            <a href="/login" className="font-black text-blue-600 hover:text-blue-700 underline decoration-blue-200">
                                Prijavi se ovde
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

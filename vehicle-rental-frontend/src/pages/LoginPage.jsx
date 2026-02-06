import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Poruka uspeha ako dolazimo sa registracije
    const successMsg = location.state?.message;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                sifra: password,
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Neispravni podaci za prijavu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-gray-100">

                {/* Info Side (Reverse for Login) */}
                <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center">
                    <h2 className="text-4xl font-black mb-6 tracking-tight">DOBRODOŠLI <br /> NAZAD.</h2>
                    <p className="text-blue-100 text-lg font-medium mb-8 leading-relaxed">
                        Vaša sledeća destinacija vas čeka. Prijavite se i nastavite tamo gde ste stala.
                    </p>
                    <div className="p-6 bg-blue-500/30 rounded-2xl border border-blue-400/30">
                        <p className="text-sm italic">"Najbolji servis za iznajmljivanje u regionu. Sve pohvale za flotu!"</p>
                        <p className="mt-4 font-black text-xs uppercase tracking-widest text-blue-200">- Zadovoljan klijent</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 p-12 md:p-16">
                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Prijavi se</h3>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Pristupite svom panelu</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {successMsg && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm font-bold">
                                {successMsg}
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Adresa"
                            type="email"
                            placeholder="vas@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Lozinka"
                            type="password"
                            placeholder="Vaša tajna šifra"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 text-lg font-black shadow-xl shadow-blue-100"
                                disabled={loading}
                            >
                                {loading ? 'Prijava...' : 'Prijavi se'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Nemaš nalog?{' '}
                            <a href="/register" className="font-black text-blue-600 hover:text-blue-700 underline decoration-blue-200">
                                Registruj se ovde
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

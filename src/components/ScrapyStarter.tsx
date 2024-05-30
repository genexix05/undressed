import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu estructura de proyecto

const brands = [
    'adidas',
    'amiri',
    'bape',
    'louisvuitton',
    'nike',
    'offwhite',
    'palace',
    'patta',
    'stussy',
    'supreme',
    'yeezy'
];

interface LoadingState {
    [key: string]: boolean;
}

function ScrapyStarter() {
    const [loading, setLoading] = useState<LoadingState>({});
    const [message, setMessage] = useState('');
    const { accessToken } = useAuth();

    const runSpider = (brandName: string) => {
        setLoading((prev) => ({ ...prev, [brandName]: true }));
        axios.get(`http://localhost:8080/http://localhost:5000/run_spider/${brandName}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            setMessage(`Spider ${brandName} ejecutado con éxito`);
            setLoading((prev) => ({ ...prev, [brandName]: false }));
        })
        .catch(error => {
            setMessage(`Error al ejecutar spider ${brandName}: ${error.message}`);
            setLoading((prev) => ({ ...prev, [brandName]: false }));
        });
    };

    const updateSpider = (brandName: string) => {
        setLoading((prev) => ({ ...prev, [brandName]: true }));
        axios.get(`http://localhost:8080/http://localhost:5000/run_spider/${brandName}_update`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            setMessage(`Spider ${brandName} actualizado con éxito`);
            setLoading((prev) => ({ ...prev, [brandName]: false }));
        })
        .catch(error => {
            setMessage(`Error al actualizar spider ${brandName}: ${error.message}`);
            setLoading((prev) => ({ ...prev, [brandName]: false }));
        });
    };

    return (
        <div>
            {brands.map((brand) => (
                <div key={brand} className="my-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => runSpider(brand)}
                        disabled={loading[brand]}
                    >
                        {loading[brand] ? `Ejecutando ${brand}...` : `Ejecutar ${brand}`}
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => updateSpider(brand)}
                        disabled={loading[brand]}
                    >
                        {loading[brand] ? `Actualizando ${brand}...` : `Actualizar ${brand}`}
                    </button>
                </div>
            ))}
            <p>{message}</p>
        </div>
    );
}

export default ScrapyStarter;

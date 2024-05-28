import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu estructura de proyecto

function ScrapyStarter() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { brandName, accessToken } = useAuth();

    const runSpider = () => {
        console.log('Intentando ejecutar spider con la marca:', brandName);
        if (!brandName) {
            setMessage('No se pudo obtener el nombre de la marca');
            return;
        }
        setLoading(true);
        axios.get(`http://localhost:8080/http://localhost:5000/run_spider/${brandName.toLowerCase()}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            setMessage('Spider ejecutado con éxito');
            setLoading(false);
        })
        .catch(error => {
            setMessage('Error al ejecutar spider: ' + error.message);
            setLoading(false);
        });
    };

    const updateSpider = () => {
        console.log('Intentando actualizar spider con la marca:', brandName);
        if (!brandName) {
            setMessage('No se pudo obtener el nombre de la marca');
            return;
        }
        setLoading(true);
        axios.get(`http://localhost:8080/http://localhost:5000/run_spider/${brandName.toLowerCase()}_update`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            setMessage('Spider actualizado con éxito');
            setLoading(false);
        })
        .catch(error => {
            setMessage('Error al actualizar spider: ' + error.message);
            setLoading(false);
        });
    };

    return (
        <div>
            <button onClick={runSpider} disabled={loading}>
                {loading ? 'Ejecutando...' : 'Ejecutar Spider'}
            </button>
            <button onClick={updateSpider} disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar Spider'}
            </button>
            <p>{message}</p>
        </div>
    );
}

export default ScrapyStarter;

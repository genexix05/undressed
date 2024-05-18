import React, { useState } from 'react';
import axios from 'axios';

function SpiderButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const runSpider = () => {
        setLoading(true);
        axios.get('http://localhost:3002/start_spider')
            .then(response => {
                setMessage('Spider ejecutado con éxito');
                setLoading(false);
            })
            .catch(error => {
                setMessage('Error al ejecutar spider: ' + error.message);
                setLoading(false);
            });
    };

    return (
        <div>
            <button onClick={runSpider} disabled={loading}>
                {loading ? 'Ejecutando...' : 'Ejecutar Spider'}
            </button>
            <p>{message}</p>
        </div>
    );
}

export default SpiderButton;

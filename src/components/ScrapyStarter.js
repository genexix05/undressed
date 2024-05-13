import React from 'react';

const ScrapyStarter = () => {
    const startSpider = async () => {
        try {
            const response = await fetch('/api/start-spider', {
                method: 'GET'
            });
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
        } catch (error) {
            console.error('Error al iniciar el spider:', error);
        }
    };

    return (
        <button onClick={startSpider}>Iniciar Spider</button>
    );
};

export default ScrapyStarter;

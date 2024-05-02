import React, { useState } from 'react';

function ScrapyStarter() {
    const [message, setMessage] = useState('');

    const startScrapy = () => {
        fetch('http://localhost:5001/run_spider/spider_name')
            .then(response => response.json())
            .then(data => setMessage(data.status))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <button onClick={startScrapy}>Start Scrapy</button>
            <p>{message}</p>
        </div>
    );
}

export default ScrapyStarter;

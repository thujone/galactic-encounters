import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("Failed to find container element with ID 'app'");
}

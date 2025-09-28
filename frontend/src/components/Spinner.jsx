import React from 'react';
import './Spinner.css';
import CircularProgress from '@mui/joy/CircularProgress';

const Spinner = ({size = 50, color = '#007bff'}) => {
    return (
        <div className="spinner-overlay">
            <CircularProgress size="lg" variant="soft"/>
        </div>
    );
};

export default Spinner;
'use client';

import { useMemo } from 'react';

export default function useCurrency(locale = 'en-US', currency = 'USD') {
    const formatter = useMemo(() => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, [locale, currency]);

    // Super safe format function that handles any edge case
    const format = (value) => {
        // Check for undefined, null, NaN, or non-numeric values
        if (value === undefined || value === null || isNaN(parseFloat(value)) || typeof value !== 'number') {
            return formatter.format(0);
        }
        try {
            return formatter.format(value);
        } catch (error) {
            console.error('Error formatting currency:', error);
            return formatter.format(0);
        }
    };

    return { format };
} 
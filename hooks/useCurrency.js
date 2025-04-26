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

    const format = (value) => {
        // Handle undefined, null, or invalid values
        if (value === undefined || value === null || isNaN(value)) {
            return formatter.format(0);
        }
        return formatter.format(value);
    };

    return { format };
} 
import { useState, useEffect } from 'react';

export interface MacroData {
    tenYearYield: number;
    dxy: number;
    vnq: number;
    expectedCapRate: number;
}

export function useMacroData() {
    const [data, setData] = useState<MacroData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);

    // Allow user to manually override the 10Y treasury for scenario planning
    const [manualYieldOffset, setManualYieldOffset] = useState(0);

    useEffect(() => {
        async function fetchMacro() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/macro');
                const result = await response.json();

                if (result.status === 'success') {
                    setData({
                        tenYearYield: result.tenYearYield,
                        dxy: result.dxy,
                        vnq: result.vnq,
                        expectedCapRate: result.expectedCapRate
                    });
                } else {
                    throw new Error(result.message || 'Failed to fetch macro data');
                }
            } catch (err) {
                // Fallback to synthetic data if backend is not running
                console.warn('Backend not reachable, using fallback macro data', err);
                setData({
                    tenYearYield: 4.25,
                    dxy: 104.5,
                    vnq: 85.2,
                    expectedCapRate: 7.25
                });
            } finally {
                setLoading(false);
            }
        }

        fetchMacro();
    }, []);

    const currentYield = data ? data.tenYearYield + manualYieldOffset : 0;
    const currentExpectedCapRate = data ? data.expectedCapRate + manualYieldOffset : 0;

    return {
        data,
        loading,
        error,
        currentYield,
        currentExpectedCapRate,
        manualYieldOffset,
        setManualYieldOffset
    };
}

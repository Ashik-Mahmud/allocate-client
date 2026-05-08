"use client";

import { set } from "date-fns";
import { useState, useEffect } from "react";

export const useDetectCountry = () => {
    const [country, setCountry] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currency, setCurrency] = useState<string>('USD');
    const [currencySymbol, setCurrencySymbol] = useState<string>('$');

    useEffect(() => {
        const detect = async () => {
            try {
                setIsLoading(true);
                // Fallback 1: Internationalization API (Instant & No CORS issues)
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                // Quick mapping for common regions
                if (timezone.includes("Dhaka")) {
                    setCountry("Bangladesh");
                    setCurrency("BDT");
                    setCurrencySymbol("৳");
                } else {
                    setCountry("United States");
                    setCurrency("USD");
                    setCurrencySymbol("$");
                }

            } catch (error) {
                console.warn("GeoIP API blocked by CORS, using timezone fallback.");
            } finally {
                setIsLoading(false);
            }
        };

        detect();
    }, []);

    return { country, isLoading, currency, currencySymbol };
};
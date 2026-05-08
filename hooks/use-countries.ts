import React, { useEffect, useState } from 'react'

type Props = {}
type CountryOption = {
    name: string;
    code: string;
}
const useCountries = () => {
    const [countries, setCountries] = useState<CountryOption[]>([])
    const [countryStatus, setCountryStatus] = useState<'loading' | 'ready' | 'error'>('loading')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        const loadCountries = async () => {
            try {
                setCountryStatus('loading')
                setIsLoading(true)
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2', {
                    signal: controller.signal,
                })

                if (!response.ok) {
                    throw new Error('Failed to load countries')
                }

                const payload = await response.json() as Array<{ name?: { common?: string }; cca2?: string }>
                const nextCountries = payload
                    .map((country) => ({
                        name: country.name?.common ?? country.cca2 ?? '',
                        code: country.cca2 ?? country.name?.common ?? '',
                    }))
                    .filter((country) => country.name.length > 0 && country.code.length > 0)
                    .sort((first, second) => first.name.localeCompare(second.name))

                setCountries(nextCountries)
                setCountryStatus('ready')
                setIsLoading(false)
            } catch {
                if (!controller.signal.aborted) {
                    setCountries([])
                    setCountryStatus('error')
                    setIsLoading(false)
                }
            }
        }

        loadCountries()

        return () => controller.abort()
    }, [])

    return { countries, countryStatus, isLoading}
}

export default useCountries
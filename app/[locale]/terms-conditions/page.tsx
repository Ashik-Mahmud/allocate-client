
import Head from 'next/head';
import TermsAndServiceComponent from '@/components/marketing/TermsAndService';

export const metadata = {
    title: "Terms and Conditions - Allocate",
    description: "Read the terms and conditions for using Allocate, the resource booking platform designed for modern organizations.",
};

const TermsAndServicePage = () => {

    return (
        <>
            <TermsAndServiceComponent />
        </>
    );
};

export default TermsAndServicePage;
import React, { lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const CustomerSendOTP = lazy(() => import('../../components/Chairmans/CustomerSendOTP'));

const CustomerSendOTPPage = () => {
    return (
        <Suspense fallback={<LazyLoader />}>
            <CustomerSendOTP />
        </Suspense>
    );
};

export default CustomerSendOTPPage;

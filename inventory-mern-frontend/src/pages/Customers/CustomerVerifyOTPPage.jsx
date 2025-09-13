import React, { lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const CustomerVerifyOTP = lazy(() => import('../../components/Chairmans/CustomerVerifyOTP'));

const CustomerVerifyOTPPage = () => {
    return (
        <Suspense fallback={<LazyLoader />}>
            <CustomerVerifyOTP />
        </Suspense>
    );
};

export default CustomerVerifyOTPPage;

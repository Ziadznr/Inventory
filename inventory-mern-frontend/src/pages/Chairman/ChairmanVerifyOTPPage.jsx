import React, { lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const ChairmanVerifyOTP = lazy(() => import('../../components/Chairmans/ChairmanVerifyOTP'));

const ChairmanVerifyOTPPage = () => {
    return (
        <Suspense fallback={<LazyLoader />}>
            <ChairmanVerifyOTP />
        </Suspense>
    );
};

export default ChairmanVerifyOTPPage;

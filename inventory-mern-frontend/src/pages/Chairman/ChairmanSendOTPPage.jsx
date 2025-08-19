import React, { lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const ChairmanSendOTP = lazy(() => import('../../components/Chairmans/ChairmanSendOTP'));

const ChairmanSendOTPPage = () => {
    return (
        <Suspense fallback={<LazyLoader />}>
            <ChairmanSendOTP />
        </Suspense>
    );
};

export default ChairmanSendOTPPage;

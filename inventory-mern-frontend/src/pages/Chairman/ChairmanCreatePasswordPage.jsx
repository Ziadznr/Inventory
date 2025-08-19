import React, { lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const ChairmanCreatePassword = lazy(() => import('../../components/Chairmans/ChairmanCreatePassword'));

const ChairmanCreatePasswordPage = () => {
    return (
        <Suspense fallback={<LazyLoader />}>
            <ChairmanCreatePassword />
        </Suspense>
    );
};

export default ChairmanCreatePasswordPage;

import React, { lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const CustomerCreatePassword = lazy(() => import('../../components/Chairmans/CustomerCreatePassword'));

const CustomerCreatePasswordPage = () => {
    return (
        <Suspense fallback={<LazyLoader />}>
            <CustomerCreatePassword />
        </Suspense>
    );
};

export default CustomerCreatePasswordPage;

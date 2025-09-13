import React, { Fragment, lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const CustomerLogin = lazy(() => import('../../components/Chairmans/CustomerLogin'));

const CustomerLoginPage = () => {
    return (
        <Fragment>
            <Suspense fallback={<LazyLoader />}>
                <CustomerLogin />
            </Suspense>
        </Fragment>
    );
};

export default CustomerLoginPage;

import React, { Fragment, lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const CustomerRegistration = lazy(() => import('../../components/Chairmans/CustomerRegistration'));

const CustomerRegistrationPage = () => {
    return (
        <Fragment>
            <Suspense fallback={<LazyLoader />}>
                <CustomerRegistration />
            </Suspense>
        </Fragment>
    );
};

export default CustomerRegistrationPage;

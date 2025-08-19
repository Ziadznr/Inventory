import React, { Fragment, lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const ChairmanRegistration = lazy(() => import('../../components/Chairmans/ChairmanRegistration'));

const ChairmanRegistrationPage = () => {
    return (
        <Fragment>
            <Suspense fallback={<LazyLoader />}>
                <ChairmanRegistration />
            </Suspense>
        </Fragment>
    );
};

export default ChairmanRegistrationPage;

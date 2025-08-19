import React, { Fragment, lazy, Suspense } from 'react';
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const ChairmanLogin = lazy(() => import('../../components/Chairmans/ChairmanLogin'));

const ChairmanLoginPage = () => {
    return (
        <Fragment>
            <Suspense fallback={<LazyLoader />}>
                <ChairmanLogin />
            </Suspense>
        </Fragment>
    );
};

export default ChairmanLoginPage;

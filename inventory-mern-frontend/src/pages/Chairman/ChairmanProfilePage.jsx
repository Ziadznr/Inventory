import React, { Fragment, lazy, Suspense } from 'react';
import MasterLayout from "../../components/MasterLayout/MasterLayout";
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const ChairmanProfile = lazy(() => import('../../components/Chairmans/ChairmanProfile'));

const ChairmanProfilePage = () => {
    return (
        <Fragment>
            <MasterLayout>
                <Suspense fallback={<LazyLoader />}>
                    <ChairmanProfile />
                </Suspense>
            </MasterLayout>
        </Fragment>
    );
};

export default ChairmanProfilePage;

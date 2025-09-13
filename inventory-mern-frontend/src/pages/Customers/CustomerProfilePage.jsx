import React, { Fragment, lazy, Suspense } from 'react';
import CustomerLayout from "../../components/Chairmans/CustomerLayout";
import LazyLoader from "../../components/MasterLayout/LazyLoader";

const CustomerProfile = lazy(() => import('../../components/Chairmans/CustomerProfile'));

const CustomerProfilePage = () => {
    return (
        <Fragment>
            <CustomerLayout>
                <Suspense fallback={<LazyLoader />}>
                    <CustomerProfile />
                </Suspense>
            </CustomerLayout>
        </Fragment>
    );
};

export default CustomerProfilePage;

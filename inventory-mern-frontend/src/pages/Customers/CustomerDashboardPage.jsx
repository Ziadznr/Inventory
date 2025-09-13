import React, {Fragment,Suspense,lazy} from 'react';
import CustomerLayout from "../../components/Chairmans/CustomerLayout";
import LazyLoader from "../../components/MasterLayout/LazyLoader";
const CustomerDashboard =lazy(() => import('../../components/Chairmans/CustomerDashboard'));
const CustomerDashboardPage = () => {
    return (
        <Fragment>
            <CustomerLayout>
                <Suspense fallback={<LazyLoader/>}>
                    <CustomerDashboard/>
                </Suspense>
            </CustomerLayout>
        </Fragment>
    );
};

export default CustomerDashboardPage;
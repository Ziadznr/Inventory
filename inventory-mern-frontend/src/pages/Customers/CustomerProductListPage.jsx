import React, {Fragment,Suspense,lazy} from 'react';
import CustomerLayout from "../../components/Chairmans/CustomerLayout";
import LazyLoader from "../../components/MasterLayout/LazyLoader";
const CustomerProductList =lazy(() => import('../../components/Chairmans/CustomerProductList'));
const CustomerProductListPage = () => {
    return (
        <Fragment>
            <CustomerLayout>
                <Suspense fallback={<LazyLoader/>}>
                    <CustomerProductList/>
                </Suspense>
            </CustomerLayout>
        </Fragment>
    );
};

export default CustomerProductListPage;
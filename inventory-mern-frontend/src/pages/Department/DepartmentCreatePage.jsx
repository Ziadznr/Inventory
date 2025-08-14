import React, { Fragment, Suspense } from 'react';
import MasterLayout from "../../components/MasterLayout/MasterLayout";
import LazyLoader from "../../components/MasterLayout/LazyLoader";
import DepartmentCreate from "../../components/Departments/DepartmentForm";

const DepartmentCreatePage = () => {
  return (
    <Fragment>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <DepartmentCreate />
        </Suspense>
      </MasterLayout>
    </Fragment>
  );
};

export default DepartmentCreatePage;

import React, { Fragment, Suspense } from 'react';
import MasterLayout from "../../components/MasterLayout/MasterLayout";
import LazyLoader from "../../components/MasterLayout/LazyLoader";
import FacultyCreateUpdate from '../../components/Faculties/FacultyCreateUpdate';
import FacultyList from '../../components/Faculties/FacultyList';

const FacultyOperationPage = () => {
  return (
    <Fragment>
      <MasterLayout>
        <Suspense fallback={<LazyLoader />}>
          <FacultyCreateUpdate />
          <FacultyList />
        </Suspense>
      </MasterLayout>
    </Fragment>
  );
};

export default FacultyOperationPage;

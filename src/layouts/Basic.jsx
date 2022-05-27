import React from 'react';
import { Outlet } from 'react-router-dom';

//component
const Basic = () => {
	return <Outlet />;
}

//container
const mBasic = React.memo(Basic);

//export
export default mBasic;
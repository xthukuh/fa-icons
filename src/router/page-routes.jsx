import React from 'react';
import { Navigate } from 'react-router-dom';

//layouts
import BasicLayout from '@/layouts/Basic';

//pages
import Error from '@/pages/Error';
import Icons from '@/pages/Icons';

//routes
const routes = [
	{
		element: <BasicLayout />,
		children: [
			{exact: true, path: '/', element: <Icons />},
			{path: '404', element: <Error title="Error 404!" description="The page you were looking for could not be found." />},
			{path: '*', element: <Navigate replace to="/404" />},
		],
	},
];

//export
export default routes;
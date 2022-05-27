import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { is, hasAnyProps } from '@/utils/helpers';

//routes
import PageRoutes from './page-routes';

//create route components
const routes = createRoutes([
	PageRoutes,
	
	//..
]);

//component
const Router = () => {
	
	//no routes
	if (!routes.length){
		console.error('Routes not configured.');
		return;
	}

	//render
	return (
		<BrowserRouter>
			<Routes>
				{routes}
			</Routes>
		</BrowserRouter>
	);
};

//container
const mRouter = React.memo(Router);

//export
export default mRouter;

//create routes
function createRoutes(routes, parentKey=''){
	return (is(routes, 'array') ? routes : [])

	//combine
	.reduce((arr, o) => {
		if (is(o, 'array')) arr.push(...o);
		else arr.push(o);
		return arr;
	}, [])

	//create
	.map((route, index) => {
		
		//ignore invalid
		if (!hasAnyProps(route, 'element', 'children')) return null;
		
		//render route
		const { children, ...props } = route;
		const key = `${parentKey}${index}`;
		const childRoutes = is(children, 'array') ? createRoutes(children, key) : [];
		if (!childRoutes.length) return <Route key={key} {...props} />;
		return <Route key={key} {...props}>{childRoutes}</Route>;
	})
	.filter(o => o !== null);
}
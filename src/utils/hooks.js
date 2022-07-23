import React from 'react';

/**
 * use safe state
 * - import { useSafeState } from '@core/hooks';
 * - const [state, setState] = useSafeState(initialState);
*/
export const useSafeState = initialState => {
	const mounted = React.useRef(true);
	const [state, setState] = React.useState(initialState);
	const setSafeState = React.useCallback(data => mounted.current && setState(data), []);
	React.useEffect(() => () => (mounted.current = false), []);
	return [state, setSafeState];
};
import PropTypes from 'prop-types';

//type children
export const TypeChildren = PropTypes.oneOfType([
	PropTypes.arrayOf(PropTypes.node),
	PropTypes.node,
	PropTypes.func
]);

//type component
export const TypeComponent = PropTypes.oneOfType([
	PropTypes.shape({ render: PropTypes.func.isRequired }),
	PropTypes.elementType,
	PropTypes.func
]);

//type icon
export const TypeIcon = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.arrayOf(PropTypes.string),
]);

//export
export default PropTypes;
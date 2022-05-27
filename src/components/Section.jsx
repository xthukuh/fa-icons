import React from 'react';
import PropTypes, { TypeChildren } from '@/utils/types';

//component
const Section = props => {
	const { tag, container, children, ...rest } = props;
	
	//render
	return React.createElement(tag, {...rest}, container ? (
		<div className='container'>
			{ children }
		</div>
	): children);
};

//prop types
Section.propTypes = {
	tag: PropTypes.string,
	container: PropTypes.bool,
	children: TypeChildren,
};

//default props
Section.defaultProps = {
	tag: 'section',
	container: true,
};

//container
const mSection = React.memo(Section);

//export
export default mSection;

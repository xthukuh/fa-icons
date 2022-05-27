import React from 'react';
import PropTypes, { TypeIcon } from '@/utils/types';
import { classNames } from '@/utils/helpers';

//fontawesome (~/plugins/fontawesome)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//component
const Fa = props => {
	const {className, icon, ...rest} = props;
	return <FontAwesomeIcon className={classNames('icon', className)} icon={icon} {...rest} />;
};

//prop types
Fa.propTypes = {
	className: PropTypes.string,
	icon: TypeIcon,
};

//container
const mFa = React.memo(Fa);

//export
export default mFa;
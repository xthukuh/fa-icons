import React from 'react';
import PropTypes, { TypeIcon } from '@/utils/types';
import Section from '@/components/Section';
import Fa from '@/components/Fa';

//component
const Error = props => {
	const { icon, title, description } = props;
	return (
		<Section>
			<div className="py-10 px-5 my-5 md:my-20 mx-auto max-w-3xl flex flex-col divide-solid divide-gray-700 md:flex-row md:divide-x items-center justify-center">
				<div className="flex flex-wrap items-center text-yellow-500 text-8xl md:text-8xl md:p-10">
					<Fa icon={icon} />
				</div>
				<div className="flex-grow text-center md:text-left py-5 md:py-10 md:px-10">
					<h1 className="text-4xl text-gray-700 font-bold">{title}</h1>
					<p className="mt-4 text-base text-gray-500">{description}</p>
				</div>
			</div>
		</Section>
	);
}

//prop types
Error.propTypes = {
	icon: TypeIcon,
	title: PropTypes.string,
	description: PropTypes.string,
};

//default props
Error.defaultProps = {
	title: 'Error',
	icon: 'exclamation-triangle',
	description: 'Unspecified system error occurred.',
};

//container
const mError = React.memo(Error);

//export
export default mError;
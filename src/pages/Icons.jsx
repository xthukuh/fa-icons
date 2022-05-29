import React from 'react';
import Fa from '@/components/Fa';
import Section from '@/components/Section';
import { fabIcons, farIcons, fasIcons } from '@/plugins/fontawesome';

//icon types
const IconTypes = {
	fas: 'solid',
	fab: 'brand',
	far: 'regular',
};

//get group icons
const getGroupIcons = group => {
	let items = {};
	for (let key in group){
		if (!group.hasOwnProperty(key)) continue;
		let icon = group[key];
		if (!('object' === typeof icon && icon && 'iconName' in icon)) continue;
		items[key] = icon;
	}
	return items;
};

//icon groups
const IconGroups = {
	fab: getGroupIcons(fabIcons),
	far: getGroupIcons(farIcons),
	fas: getGroupIcons(fasIcons),
};

//get type icons
const getTypeIcons = type => {
	const items = [];
	const group = IconGroups[type];
	for (let key in group){
		if (!group.hasOwnProperty(key)) continue;
		const { iconName, prefix } = group[key];
		if (iconName === 'ad') continue;
		items.push({key, iconName, prefix});
	}
	return items;
};

//DEBUG:
window._IconTypes = IconTypes;
window._IconGroups = IconGroups;
window._getTypeIcons = getTypeIcons;

//component
const Icons = () => {
	const [search, setSearch] = React.useState('');
	const [iconType, setIconType] = React.useState('fas');
	const [selected, setSelected] = React.useState(null);

	const onSearch = React.useCallback(e => {
		setSearch(e.target.value);
		setSelected(null);
	}, []);
	
	const onClear = React.useCallback(() => {
		setSearch('');
		setSelected(null);
		window.scrollTo(0, 0);
	}, []);

	const onIconType = React.useCallback(e => {
		setIconType(e.target.value);
		setSelected(null);
		window.scrollTo(0, 0);
	}, []);

	const onItem = React.useCallback(item => {
		setSelected(item);
		window.scrollTo(0, 0);
	}, []);

	const typeIcons = React.useMemo(() => getTypeIcons(iconType, search), [iconType, search]);
	
	const searchIcons = React.useMemo(() => {
		const searchQuery = search.trim();
		return !searchQuery ? typeIcons : typeIcons.filter(item => {
			return item.iconName.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
		});
	}, [typeIcons, search]);

	const isSelected = React.useCallback(item => selected && selected.prefix === item.prefix && selected.iconName === item.iconName, [selected]);

	return (
		<Section>
			<div className="bg-gray-200 pt-2">
				<h1 className="text-3xl text-blue-500">Fa Icons</h1>
				<p className="text-base text-gray-600 font-bold italic">
					<span>Fortawesome {IconTypes[iconType]}</span>&nbsp;
					<span>({`${searchIcons.length === typeIcons.length ? typeIcons.length : searchIcons.length + '/' + typeIcons.length}`} icons)</span>
				</p>
				<div className="mt-2 flex flex-col md:flex-row border-t border-gray-400">
					<div className="pt-2 mr-4 flex flex-row items-center">
						{Object.keys(IconTypes).map((key, index) => {
							return (
								<label key={index} className="w-20 whitespace-nowrap cursor-pointer">
									<input
										type="radio"
										name="type"
										value={key}
										onChange={onIconType}
										defaultChecked={iconType === key} />
									<span className="ml-1">{IconTypes[key]}</span>
								</label>
							);
						})}
					</div>
					<div className="pt-2 flex-grow flex flex-row items-center">
						<input
						type="text"
						className="px-2 py-1 outline-none border border-gray-500 flex-grow"
						placeholder="Search"
						onChange={onSearch}
						value={search}
						/>
						<button type="button" className="ml-2 bg-gray-500 text-white px-2 py-1" onClick={onClear}>Clear</button>
					</div>
				</div>
			</div>
			<div className="flex flex-row gap-1 mt-2">
				{!selected ? <div className="p-3 bg-gray-900 text-white text-xs font-mono flex-grow">Click to select icon.</div> : (
					<>
					<div class="flex justify-center items-center w-20 bg-gray-900 text-white p-4">
						<Fa className="text-3xl" icon={[selected.prefix, selected.iconName]} fixedWidth />
					</div>
					<div className="p-3 bg-gray-900 text-white text-xs font-mono flex-grow">
						<span className="text-green-500">{`import { ${selected.key} } from '@fortawesome/free-${IconTypes[iconType]}-svg-icons';`}</span><br />
						<span className="text-yellow-500">{`<FontAwesomeIcon icon={['${selected.prefix}', '${selected.iconName}']} />`}</span>
					</div>
					</>
				)}
			</div>
			<div className="border-bottom my-3 gap-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
				{searchIcons.map((item, i) => {
					return (
						<a
						key={i}
						className={`w-full px-2 py-4 text-center cursor-pointer ${isSelected(item) ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-white hover:bg-gray-300 text-gray-800'}`}
						style={{fontSize: '10px', '&:active': {backgroundColor: 'white'}}}
						onClick={() => onItem(item)}
						title={`[${item.prefix}, ${item.iconName}]`}>
							<Fa className="text-2xl" icon={[item.prefix, item.iconName]} fixedWidth />
							<p className="mt-2 text-xs">
								{item.iconName.replace(/-/g, ' ')}
							</p>
						</a>
					);
				})}
			</div>
		</Section>
	);
}

//container
const mIcons = React.memo(Icons);

//export
export default mIcons;
import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fabIcons, farIcons, fasIcons } from '@/plugins/fontawesome';
import { useSafeState } from '@/utils/hooks';
import Fa from '@/components/Fa';
import Section from '@/components/Section';

//icon types
const IconTypes = {
	fas: 'solid',
	fab: 'brand',
	far: 'regular',
};

//is icon name
const isIconName = name => {
	if ('number' === typeof name) name = String(name);
	return 'string' === typeof name
	&& !!name.match(/^[-0-9a-zA-Z]+$/)
	&& !!name.replace(/[^0-9a-z]+/ig, '_').replace(/^_|_$/g, '').length;
};

//is icon prefix
const isIconPrefix = prefix => ['fas', 'fab', 'far'].includes(prefix);

//is fa icon object
const isFaIconObject = icon => !!icon
&& 'object' === typeof icon
&& isIconPrefix(icon.prefix)
&& isIconName(icon.iconName)
&& Array.isArray(icon.icon) && icon.icon.length > 2;

//get group icons
const getGroupIcons = group => {
	let items = {};
	for (let key in group){
		if (!group.hasOwnProperty(key)) continue;
		let icon = group[key];
		if (!isFaIconObject(icon)) continue;
		let {prefix, iconName, ...rest} = icon;
		let tmp = library?.definitions?.[prefix]?.[iconName]?.[2];
		let names = Array.from(new Set([iconName].concat(tmp))).filter(o => isIconName(o)).map(o => String(o));
		let prefixName = `['${prefix}', '${iconName}']`;
		items[key] = {key, names, prefixName, prefix, iconName, ...rest};
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
const getTypeIcons = type => IconGroups.hasOwnProperty(type) ? Object.values(IconGroups[type]) : [];

//DEBUG:
window._Icons = {
	library,
	IconTypes,
	isIconName,
	isIconPrefix,
	isFaIconObject,
	getGroupIcons,
	IconGroups,
	getTypeIcons,
};

//component
const Icons = () => {
	
	//state
	const [search, setSearch] = useSafeState('');
	const [iconType, setIconType] = useSafeState('fas');
	const [selected, setSelected] = useSafeState(null);

	//scroll top
	const scrollTop = React.useCallback(() => document.scrollingElement.scrollTo(0, 0), []);

	//on search
	const onSearch = React.useCallback(e => {
		setSearch(e.target.value);
		setSelected(null);
	}, []);
	
	//on clear
	const onClear = React.useCallback(() => {
		setSearch('');
		setSelected(null);
		scrollTop();
	}, []);

	//on icon type
	const onIconType = React.useCallback(e => {
		setIconType(e.target.value);
		setSelected(null);
		scrollTop();
	}, []);

	//on item
	const onItem = React.useCallback(item => {
		setSelected(item);
	}, []);

	//is selected
	const isSelected = React.useCallback(item => selected && item && selected.key === item.key, [selected]);

	//type icons
	const typeIcons = React.useMemo(() => getTypeIcons(iconType, search), [iconType, search]);
	
	//search icons
	const searchIcons = React.useMemo(() => {
		const searchQuery = search.trim();
		return typeIcons.filter(item => {
			let q = searchQuery.toLowerCase();
			return item.names.findIndex(o => (o.toLowerCase().indexOf(q) > -1 || q.indexOf(o.toLowerCase()) > -1)) > -1;
		});
	}, [typeIcons, search]);

	//DEBUG:
	window._IconsContext = {
		search,
		setSearch,
		iconType,
		setIconType,
		selected,
		setSelected,
		onSearch,
		onClear,
		onIconType,
		onItem,
		typeIcons,
		searchIcons,
		isSelected,
	};

	//render
	return (
		<Section className="relative">
			
			{/* scroll top */}
			<button
			className="fixed right-4 p-1 text-sm border text-white"
			style={{top: '88vh', background: 'rgba(0,0,0,.5)'}}
			onClick={scrollTop}>
				<Fa className="text-2xl p-2" icon={['fas', 'arrow-up']} fixedWidth />
			</button>

			{/* header */}
			<div className="bg-gray-200 pt-2">
				
				{/* title */}
				<h1 className="text-3xl text-blue-500">Fa Icons</h1>
				<p className="text-base text-gray-600 font-bold italic">
					<span>Fortawesome {IconTypes[iconType]}</span>&nbsp;
					<span>({`${searchIcons.length === typeIcons.length ? typeIcons.length : searchIcons.length + '/' + typeIcons.length}`} icons)</span>
				</p>

				{/* form */}
				<div className="mt-2 flex flex-col md:flex-row border-t border-gray-400">
					
					{/* icon types */}
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

					{/* icon search */}
					<div className="pt-2 flex-grow flex flex-row items-center">
						
						{/* search */}
						<input
						type="text"
						className="px-2 py-1 outline-none border border-gray-500 flex-grow"
						placeholder="Search"
						onChange={onSearch}
						value={search}
						/>

						{/* clear */}
						<button type="button" className="ml-2 bg-gray-500 text-white px-2 py-1" onClick={onClear}>Clear</button>
					</div>
				</div>
			</div>

			{/* selected icon */}
			<div className="flex flex-row gap-1 mt-2">
				{!selected ? <div className="p-3 bg-gray-900 text-white text-xs font-mono flex-grow">Click to select icon.</div> : (
					<>
					{/* icon */}
					<div className="flex justify-center items-center w-20 bg-gray-900 text-white p-4">
						<Fa className="text-3xl" icon={[selected.prefix, selected.iconName]} fixedWidth />
					</div>
					
					{/* code */}
					<div className="p-3 bg-gray-900 text-white text-xs font-mono flex-grow">
						<span className="text-green-500">{`import { ${selected.key} } from '@fortawesome/free-${IconTypes[iconType]}-svg-icons';`}</span><br />
						<span className="text-yellow-500">{`<FontAwesomeIcon icon={['${selected.prefix}', '${selected.iconName}']} />`}</span><br />
						<span className="text-gray-500">{`//${selected.names.join(', ')}`}</span>
					</div>
					</>
				)}
			</div>

			{/* search icons */}
			<div className="border-bottom my-3 gap-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
				{searchIcons.map((item, i) => {

					{/* search icon */}
					return (
						<a
						key={i}
						className={`w-full break-words text-center py-2 cursor-pointer ${isSelected(item) ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-white hover:bg-gray-300 text-gray-800'}`}
						style={{fontSize: '10px', '&:active': {backgroundColor: 'white'}}}
						onClick={() => onItem(item)}
						title={item.prefixName}
						>
							{/* icon */}
							<Fa className="text-2xl p-2" icon={[item.prefix, item.iconName]} fixedWidth />

							{/* text */}
							{[item.prefix, item.key].concat(item.names).map((name, k) => {
								return <p key={k} className={`text-xs p-1 ${(k ? 'border-t' : '')}`}>{name}</p>;
							})}
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
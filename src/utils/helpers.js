//runtime error (throwable)
export class RuntimeError extends Error
{
	constructor(message, data, ...params){
		super(...[message, ...params]);
		if (Error.captureStackTrace) Error.captureStackTrace(this, RuntimeError);
		this.name = 'RuntimeError';
		this.data = data;
		this.date = new Date();
	}
}

//throw runtime error
export const throwRuntimeError = (message, data, ...params) => {
	throw new RuntimeError(message, data, ...params);
};

//uid
export const uid = () => Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

//type checking
export const is = (value, type, options={}) => {
	const {nullable, trim, notArray, notInt} = options;

	//is alphanumeric
	if (type === 'alphan') return ('string' === typeof value || 'number' === typeof value);
	if (type === 'alphan-filled') return is(value, 'alphan') && !!(trim ? String(value).trim() : String(value)).length;
	
	//is string
	if (type === 'string') return 'string' === typeof value;
	if (type === 'string-filled') return is(value, 'string') && !!(trim ? value.trim() : value).length;
	
	//is numeric
	if (type === 'number') return 'number' === typeof value;
	if (type === 'numeric') return is(value, 'number') || (is(value, 'string') && !isNaN(parseFloat(value)));
	if (type === 'integer') return is(value, 'number') && Number.isInteger(value);
	if (type === 'float') return is(value, 'number') && (notInt ? !Number.isInteger(value) : true);
	if (type === 'number-positive') return is(value, 'number') && value >= 0;
	if (type === 'integer-positive') return is(value, 'integer') && value >= 0;
	if (type === 'float-positive') return is(value, 'float') && value >= 0;
	
	//is boolean
	if (type === 'boolean') return 'boolean' === typeof value;
	if (type === 'bool') return is(value, 'boolean') || [0, 1].includes(value);
	
	//is object
	if (type === 'object') return 'object' === typeof value && (nullable ? true : Boolean(value)) && (notArray ? !Array.isArray(value) : true);
	if (type === 'object-filled') return is(value, 'object', options) && !!Object.keys(value).length;
	
	//is array
	if (type === 'array') return Array.isArray(value);
	if (type === 'array-filled') return Array.isArray(value) && !!value.length;
	
	//is undefined
	if (type === 'undefined') return value === undefined;
	
	//is null
	if (type === 'null') return value === null;
	
	//is function
	if (['function', 'func'].includes(type)) return 'function' === typeof value;
	
	//is filled
	if (type === 'filled'){
		if (value === undefined || value === null) return false;
		if ('string' === typeof value) return is(value, 'string-filled', options);
		if (Array.isArray(value)) return is(value, 'array-filled', options);
		if ('object' === typeof value) return is(value, 'object-filled', options);
		return true;
	}

	//is empty
	if (type === 'empty') return !is(value, 'filled', options);

	//is set
	return !(value === undefined || (value === null && !nullable));
};

//to string
export const toStr = val => !is(val) ? '' : String(val);

//to number
export const toNum = (val, _default, _parse=true) => !isNaN(val = is(val, 'string') && _parse ? parseFloat(val) : Number(val)) ? val : _default;

//to number - abs
export const toNumAbs = (val, _default, _parse=true) => !isNaN(val = is(val, 'string') && _parse ? parseFloat(val) : Number(val)) ? Math.abs(val) : _default;

//to int
export const toInt = (val, _default, _parse=true, _round=false) => {
	let num = toNum(val, false, _parse);
	if (num === false) return _default;
	return _round ? Math.round(val) : Math.floor(val);
};

//to int - abs
export const toIntAbs = (val, _default, _parse=true, _round=false) => {
	let num = toNumAbs(val, false, _parse);
	if (num === false) return _default;
	return _round ? Math.round(val) : Math.floor(val);
};

//round
export const round = (val, places=2) => {
	return +toNum(val, 0).toFixed(toIntAbs(places, 2));
};

//commas
export const commas = (val, places=2) => {
	return String(round(val, places)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

//has property
export const hasProp = (obj, name) => is(obj, 'object') && name in obj;

//has properties
export const hasProps = (obj, ...names) => is(obj, 'object-filled') && !names.filter(name => !(name in obj)).length;

//has any properties
export const hasAnyProps = (obj, ...names) => is(obj, 'object-filled') && Boolean(names.filter(name => name in obj).length);

//get property value
export const getProp = (path, obj) => toStr(path).split('.')
.map(o => o.trim())
.filter(o => o.length)
.reduce((val, key) => {
	if (hasProp(val, key)) return val[key];
	if (is(val, 'array') && Number.isInteger(key = toNum(key)) && key < 0) return val.slice(key);
	return undefined;
}, obj);

//json parse
export const jsonParse = (json, _default) => {
	try {
		let val = JSON.parse(json);
		return is(val) ? val : _default;
	}
	catch (e){
		return _default;
	}
};

//json stringify
export const jsonStringify = value => {
	const seen = [];
	return JSON.stringify(value, function(key, val){
		if (is(val, 'object')){
			if (seen.indexOf(val) >= 0) return;
			seen.push(val);
		}
		return val;
	});
};

//is date
export const isDate = date => Date instanceof date && !isNaN(date.getTime());

//date time
export const time = date => (isDate(date) ? date : new Date()).getTime();

//base 64 helper
export const base64 = {
	encode: val => btoa(String(val)),
	decode: val => atob(String(val)),
};

//window.localStorage helper
export const winStore = {
	store: function(){
		try {
			const storage = window['localStorage'], x = 'x';
			storage.setItem(x, x);
			storage.removeItem(x);
			return storage;
		}
		catch(e) {
			throwRuntimeError('window.localStorage is not available!', e);
		}
	},
	get: function(key, _default){
		const store = this.store();
		let val = store.getItem(key);
		let is_encoded = parseInt(store.getItem(`__${key}b64__`)) === 1;
		if (val && is_encoded) val = base64.decode(val);
		return jsonParse(val, _default);
	},
	set: function(key, value, _base64_encode=false){
		const store = this.store();
		let val = jsonStringify(value);
		if (_base64_encode){
			val = base64.encode(val);
			store.setItem(`__${key}b64__`, 1);
		}
		store.setItem(key, val);
	},
	remove: function(key){
		const store = this.store();
		store.removeItem(key);
		store.removeItem(`__${key}b64__`);
	},
};

//clone object
export const clone = obj => {
	if (!('object' === typeof obj && obj)) return obj;
	if (obj instanceof Date) return Object.assign(new Date(obj.toString()), obj);
	let temp = new obj.constructor();
	for (let key in obj)
		temp[key] = clone(obj[key]);
	return temp;
};

//compare objects
export const equals = (a, b) => {
	if (a === b) return true;
	if (!(a instanceof Object) || !(b instanceof Object)) return false;
	if (a.constructor !== b.constructor) return false;
	let k;
	for (k in a){
		if (!a.hasOwnProperty(k)) continue;
		if (!b.hasOwnProperty(k)) return false;
		if (a[k] === b[k]) continue;
		if ('object' !== typeof(a[k])) return false;
		if (!equals(a[k], b[k])) return false;
	}
	for (k in b){
		if (b.hasOwnProperty(k) && !a.hasOwnProperty(k)) return false;
	}
	return true;
};

//event preventDefault/stopPropagation
export const preventDefault = (event, stopPropagation=false, _return=false) => {
	if (hasProp(event, 'preventDefault') && is(event.preventDefault, 'function')) event.preventDefault();
	if (stopPropagation && hasProp(event, 'stopPropagation') && is(event.stopPropagation, 'function')) event.stopPropagation();
	return _return;
};

//sleep promise
export const sleep = ms => new Promise(resolve => setTimeout(() => resolve(ms), ms));

//merge classes
export const classNames = (...names) => {
	return Array.from(new Set(Array(names).reduce((arr, o) => {
		if (is(o, 'array')) arr.push(...o);
		else if (is(o, 'string')) arr.push(...o.split(' '));
		else arr.push(o);
		return arr;
	}, [])
	.filter(o => is(o, 'string-filled', {trim: 1}))
	.map(o => o.trim())))
	.join(' ');
};

//preload images
const preloadImagesList = [];
export const preloadImages = (...images) => {
	Array(images).reduce((arr, o) => {
		if (is(o, 'array')) arr.push(...o);
		else arr.push(o);
		return arr;
	}, [])
	.filter(o => is(o, 'string-filled', {trim: 1}))
	.forEach(src => {
		const img = new Image();
		img.onload = function(){
			let index = preloadImagesList.indexOf(this);
			if (index !== -1) preloadImagesList.splice(index, 1);
		};
		img.onerror = function(error){
			throwRuntimeError('Preload image failure.', {img, src, error});
		};
		preloadImagesList.push(img);
		img.src = src;
	});
};

//is element
export const isElement = val => {
	try {
		return val instanceof HTMLElement ? val : false;
	}
	catch (e){
		if (
			hasProps(val, 'nodeType', 'style', 'ownerDocument')
			&& val.nodeType === 1
			&& is(val.style, 'object')
			&& is(val.ownerDocument, 'object')
		) return val;
		return false;
	}
};

//is node element
export const isNode = val => isElement(val) && val.nodeType === Node.ELEMENT_NODE ? val : false;

//check node is parent's descendant
export const childOf = (node, parent) => {
	if (!(isElement(node) && isElement(parent))) return false;
	while ((node=node.parentNode) && node !== parent);
	return !!node;
};

//get random int
export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;

//Debounce
export class Debounce
{
	constructor(callback, delay){
		this.callback = callback;
		this.delay = delay ? toIntAbs(delay, 500) : 500;
		this.timeout = null;
		this.call = this.call.bind(this);
	}

	call(value){
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(() => is(this.callback, 'function') ? this.callback(value) : null, this.delay);
	}
};

//to title case
export const toTitleCase = str => String(str).replace(/\w\S*/g, txt => {
	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
});

//get error message
export const getErrorMessage = (error, data) => {
	let err = [];
	if (error instanceof Error || hasProp(error, 'message')) error = error.message;
	if (is(error, 'string-filled', {trim: 1})) err.push(error.trim());
	if (hasProp(data, 'message') && is(data.message, 'string-filled', {trim: 1})) err.push(data.message.trim());
	if (hasProp(data, 'error') && is(data.error, 'string-filled', {trim: 1})) err.push(data.error.trim());
	return err.length ? (err.join('. ') + '.').replace('..', '.') : '';
};
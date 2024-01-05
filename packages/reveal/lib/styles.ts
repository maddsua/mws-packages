
const styleDirectives = [
	'html, body {overflow-x: hidden}',
	'* {box-sizing: border-box}'
];

export const injectStyles = () => {

	if (typeof document !== 'object') 
		throw new Error('document global object is inaccessible')

	const style = document.createElement('style');
		style.id = 'reveal-v3-critical-styles';
		style.innerHTML = styleDirectives.join('\n');
	document.head.appendChild(style)
};

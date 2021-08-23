module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.svelte'],
	theme: {
		extend: {
			width: {
				fit: 'fit-content'
			},
			flexGrow: {
				2: '2'
			}
		}
	}
};

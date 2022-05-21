/* eslint-disable prettier/prettier */
import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export const theme = createTheme({
	palette: {
		primary: {
			main: '#44546A',
		},
		secondary: {
			main: '#eeeeee',
		},
		correct: {
			main: '#e313f3',
		},
		error: {
			main: red.A400,
		},
		background: {
			default: '#fbfbfb',
		},
	},
});

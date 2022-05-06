import React, { useState, useEffect } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import NavBottom from './navBottom';
import NavTop from './navTop';
import { authService } from './fbase';
import router from 'next/router';

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
}));

export default function SignIn() {
	const classes = useStyles();

	const [init, setInit] = React.useState(false);
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);
	React.useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
				router.push('/home');
			}
			setInit(true);
		});
	}, []);

	return (
		<React.Fragment>
			<NavTop />
			<NavBottom />
		</React.Fragment>
	);
}

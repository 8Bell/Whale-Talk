import React, { useState } from 'react';
import Head from 'next/head';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { authService } from './fbase';
import { Checkbox, FormControlLabel, Switch, withStyles } from '@material-ui/core';

function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright © '}
			<Link color='inherit' href='/home'>
				Whale Talk
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	icon: {
		width: 200,
		height: 200,
	},

	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	textField: {
		margin: theme.spacing(0.7),
	},
	submit: {
		margin: theme.spacing(2, 0, 2, 0.6),
		height: '45px',
	},
	checkBox: {
		marginLeft: -4,
	},
}));

export default function SignIn() {
	const classes = useStyles();

	const [auth, setAuth] = React.useState(authService.currentUser);
	setInterval(() => {
		console.log(authService.currentUser);
	}, 5000);

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const onChange = (e) => {
		const {
			target: { id, value },
		} = e;
		if (id === 'email') {
			setEmail(value);
		} else if (id === 'password') {
			setPassword(value);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			let data = await authService.signInWithEmailAndPassword(email, password);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	//Toggle Switch //
	const IOSSwitch = withStyles((theme: Theme) => ({
		root: {
			width: 38,
			height: 22,
			padding: 0,
			margin: theme.spacing(1),
		},
		switchBase: {
			padding: 1,
			'&$checked': {
				transform: 'translateX(16px)',
				color: theme.palette.common.white,
				'& + $track': {
					backgroundColor: '#44546A',
					opacity: 1,
					border: 'none',
				},
			},
			'&$focusVisible $thumb': {
				color: '#44546A',
				border: '6px solid #fff',
			},
		},
		thumb: {
			width: 20,
			height: 20,
		},
		track: {
			borderRadius: 26 / 2,
			border: `1px solid ${theme.palette.grey[400]}`,
			backgroundColor: theme.palette.grey[50],
			opacity: 1,
			transition: theme.transitions.create(['background-color', 'border']),
		},
		checked: {},
		focusVisible: {},
	}))(({ classes, ...props }: Props) => {
		return (
			<Switch
				focusVisibleClassName={classes.focusVisible}
				disableRipple
				classes={{
					root: classes.root,
					switchBase: classes.switchBase,
					thumb: classes.thumb,
					track: classes.track,
					checked: classes.checked,
				}}
				{...props}
			/>
		);
	});

	const [toggleChecked, setToggleChecked] = React.useState({
		togglecheck: false,
	});

	const handleChange = (e) => {
		setToggleChecked({ ...toggleChecked, [e.target.name]: e.target.checked });
		console.log(toggleChecked);
		if (toggleChecked == false) {
			authService.setPersistence(authService.Auth.Persistence.LOCAL);
		} else if (toggleChecked == true) {
			authService.setPersistence(firebase.auth.Auth.Persistence.SESSION);
		}
		console.log(authService);
	};
	//End Toggle Switch//

	return (
		<React.Fragment>
			<Head>
				<title>Whale Talk</title>
			</Head>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<div className={classes.paper}>
					<img src='./images/icon.png' className={classes.icon} />

					<form className={classes.form} noValidate onSubmit={onSubmit}>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='email'
							label='이메일을 입력하세요'
							name='email'
							autoComplete='email'
							autoFocus
							className={classes.textField}
							value={email}
							onChange={onChange}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='비밀번호를 입력하세요'
							type='password'
							id='password'
							autoComplete='current-password'
							className={classes.textField}
							value={password}
							onChange={onChange}
						/>

						<FormControlLabel
							label='자동 로그인'
							control={
								<IOSSwitch
									checked={toggleChecked.togglecheck}
									onChange={handleChange}
									name='togglecheck'
								/>
							}
							className={classes.checkBox}
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}>
							로그인
						</Button>
						<Grid container>
							<Grid item xs></Grid>
							<Grid item>
								<Link href='sign-up' variant='body2'>
									{'회원이 아니신가요? 3초만에 가입하기'}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
				<Box mt={8}>
					<Copyright />
				</Box>
			</Container>
		</React.Fragment>
	);
}

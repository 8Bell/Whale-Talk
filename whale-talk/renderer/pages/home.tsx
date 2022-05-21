/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { authLocal, authService, authSession } from '../fbase';
import { FormControlLabel, Switch, withStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import Link from '../components/Link';

import { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch';
import Image from 'next/image';

function Copyright() {
	return (
		<Typography
			variant='body2'
			color='textSecondary'
			align='center'
			style={{
				position: 'absolute',
				bottom: '30px',
				left: '50%',
				transform: 'translateX(-50%)',
			}}>
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
		minHeight: 400,
		minWidth: 300,
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
	},
	icon: {
		width: 250,
		height: 250,
	},

	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	textField: {
		margin: theme.spacing(0.7),
	},
	submit: {
		margin: theme.spacing(5, 0, 2, 0.6),
		height: '50px',
	},
	checkBox: {
		marginLeft: 0,
	},
}));

export default function SignIn() {
	const classes = useStyles();
	const router = useRouter();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [init, setInit] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
				router.push('/friends');
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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
			await authService.signInWithEmailAndPassword(email, password);
			console.log(authService);
		} catch (error) {
			console.log(error);
			switch (error.code) {
				case 'auth/wrong-password':
					alert('아이디 혹은 비밀번호가 틀렸습니다.');
					break;
				case 'auth/user-not-found':
					alert('아이디 혹은 비밀번호가 틀렸습니다.');
					break;
				case 'auth/invalid-email':
					alert('이메일 양식이 올바르지 않습니다.');
					break;
				case 'auth/too-many-requests':
					alert('잠시 뒤 다시 시도해주세요');
					break;
			}
		}
	};

	//Toggle Switch //
	interface Styles extends Partial<Record<SwitchClassKey, string>> {
		focusVisible?: string;
	}

	interface Props extends SwitchProps {
		classes: Styles;
	}
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

	const [toggleChecked, setToggleChecked] = useState({
		togglecheck: true,
	});

	const handleChange = (e) => {
		setToggleChecked({ ...toggleChecked, [e.target.name]: e.target.checked });
		console.log(toggleChecked);
		if (toggleChecked.togglecheck == false) {
			authService.setPersistence(authLocal);
			console.log('계정 로컬 저장 활성화');
		} else if (toggleChecked.togglecheck == true) {
			authService.setPersistence(authSession);
			console.log('계정 로컬 저장 비활성화');
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Whale Talk</title>
			</Head>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<div className={classes.paper}>
					<Image
						src='./images/whale plastic 2@0.5x.png'
						alt='whale icon'
						className={classes.icon}
					/>

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
						<div
							style={{
								position: 'absolute',
								right: 0,
								height: '40px',
								transform: 'translateX(25px)',
							}}>
							<div
								style={{
									fontSize: '15px',
									color: '#777',
									display: 'inline-block',
									transform: 'translateY(2px)',
								}}>
								접속시 자동로그인
							</div>
							<FormControlLabel
								control={
									<IOSSwitch
										checked={toggleChecked.togglecheck}
										onChange={handleChange}
										name='togglecheck'
									/>
								}
								className={classes.checkBox}
								label={''}
							/>
						</div>
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
								<Link href='/sign-up' variant='body2'>
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

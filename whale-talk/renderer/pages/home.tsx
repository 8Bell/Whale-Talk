import React from 'react';
import Head from 'next/head';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	textField: {
		margin: theme.spacing(0),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignIn() {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Head>
				<title>Whale Talk</title>
			</Head>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>

					<form className={classes.form} noValidate>
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
						/>
						{/* <FormControlLabel
						control={<Checkbox value='remember' color='primary' />}
						label='Remember me'
					/> */}
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}>
							로그인하기
						</Button>
						<Grid container>
							<Grid item xs></Grid>
							<Grid item>
								<Link href='sign-up' variant='body2'>
									{'회원이 아니신가요? 지금 가입하세요'}
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

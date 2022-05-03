import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import fbase from './fbase';

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

	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(0),
	},
	textField: {
		marginTop: theme.spacing(-1),
	},
	submit: {
		margin: theme.spacing(2, 0, 2),
		height: '45px',
	},
	title: {
		margin: theme.spacing(-2, 0, 3, 0),
		fontSize: '20px',
		color: '#44546A',
	},
}));

export default function SignUp() {
	const classes = useStyles();

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<img src='./images/icon.png' />
				<Typography component='h1' variant='h5' className={classes.title}>
					가입하기
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								id='Name'
								label='성함'
								name='Name'
								autoComplete='lname'
								className={classes.textField}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								id='email'
								label='이메일을 입력하세요'
								name='email'
								autoComplete='email'
								className={classes.textField}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								name='password'
								label='비밀번호를 입력하세요'
								type='password'
								id='password'
								autoComplete='current-password'
								className={classes.textField}
							/>
						</Grid>
						{/* <Grid item xs={12}>
							<FormControlLabel
								control={
									<Checkbox
										value='allowExtraEmails'
										color='primary'
									/>
								}
								label='I want to receive inspiration, marketing promotions and updates via email.'
							/>
						</Grid> */}
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}>
						가입하기
					</Button>
					<Grid container justifyContent='flex-end'>
						<Grid item xs></Grid>
						<Grid item>
							<Link href='/home' variant='body2'>
								회원이신가요? 로그인하기
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
		</Container>
	);
}

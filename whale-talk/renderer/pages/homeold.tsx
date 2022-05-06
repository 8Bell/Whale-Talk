import React from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles, createTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Link from '../components/Link';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		img: {
			marginTop: 300,
		},
	})
);

function Home() {
	const classes = useStyles({});
	const [open, setOpen] = React.useState(false);
	const handleClose = () => setOpen(false);
	const handleClick = () => setOpen(true);

	return (
		<React.Fragment>
			<Head>
				<title>Whale Talk</title>
			</Head>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />

				<Grid className='classes.img'>
					<img src='/images/logo.png' />
				</Grid>

				<Button
					href='/sign-in'
					type='submit'
					fullWidth
					variant='contained'
					color='primary'>
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
			</Container>
		</React.Fragment>
	);
}

export default Home;

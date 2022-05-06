import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import OfflinePinRoundedIcon from '@material-ui/icons/OfflinePinRounded';
import AddCommentRoundedIcon from '@material-ui/icons/AddCommentRounded';
import { Zoom } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100vw',
			height: 60,
			position: 'fixed',
			top: 0,
			left: '50%',
			transform: 'translate(-50%, 0)',
			backgroundColor: '#eeeeee',
			zIndex: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
		plusIconBtn: {
			position: 'absolute',
			zIndex: 2,
			top: 4,
			right: 4,
		},
		nextIconBtn: {
			position: 'absolute',
			zIndex: 2,
			top: 4,
			right: 4,
			color: 'green',
		},
	})
);

export default function NavTop({ chatMakingState, setChatMakingState }) {
	const classes = useStyles();
	const [auth, setAuth] = React.useState(true);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAuth(event.target.checked);
	};

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setChatMakingState(!chatMakingState);
	};

	const handleAddFriend = () => {
		prompt('친구를 추가하시겠습니까?');
	};

	return (
		<div className={classes.root}>
			<FormGroup></FormGroup>
			<AppBar position='static' color='secondary'>
				<Toolbar>
					<Typography variant='h5' className={classes.title}>
						친구
					</Typography>
					{auth && (
						<div>
							<Zoom in={!chatMakingState}>
								<IconButton
									aria-label='account of current user'
									aria-controls='menu-appbar'
									aria-haspopup='true'
									onClick={handleMenu}
									color='inherit'
									className={classes.plusIconBtn}>
									<AddRoundedIcon />
								</IconButton>
							</Zoom>
							<Zoom in={chatMakingState}>
								<IconButton
									onClick={handleClose}
									className={classes.nextIconBtn}>
									<AddCommentRoundedIcon />
								</IconButton>
							</Zoom>

							<Menu
								id='menu-appbar'
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}>
								<MenuItem onClick={handleClose}>
									채팅 추가하기
								</MenuItem>
								<MenuItem onClick={handleAddFriend}>
									친구 추가하기
								</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
}

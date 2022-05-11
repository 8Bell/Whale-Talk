import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import { authService } from './fbase';
import Link from '../components/Link';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
	root: {
		width: '100vw',
		height: 60,
		position: 'fixed',
		bottom: 0,
		left: '50%',
		transform: 'translate(-50%, 0)',
		backgroundColor: '#eeeeee',
	},
});

export default function ChatsNavBottom() {
	const router = useRouter();
	const classes = useStyles();
	const [value, setValue] = React.useState('chats');

	const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		setValue(newValue);
	};
	const onClick = () => {
		authService.signOut();
	};

	return (
		<BottomNavigation value={value} onChange={handleChange} className={classes.root}>
			<BottomNavigationAction
				onClick={() => {
					router.push('/friends');
				}}
				label='친구'
				value='friends'
				icon={<PeopleAltRoundedIcon />}></BottomNavigationAction>

			<BottomNavigationAction
				label='채팅'
				value='chats'
				icon={<ChatRoundedIcon />}></BottomNavigationAction>

			<BottomNavigationAction
				onClick={onClick}
				label='로그아웃'
				value='signOut'
				icon={<LockRoundedIcon />}
			/>
		</BottomNavigation>
	);
}

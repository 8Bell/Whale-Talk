import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import { authService } from '../fbase';
import Link from './Link';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
	root: {
		width: 'calc(100vw - 40px)',
		height: 65,
		position: 'fixed',
		bottom: 20,
		left: '20px',

		backgroundColor: 'rgba(220,220,220,0.2)',
		backdropFilter: 'blur(7px)',
		boxShadow: '0 0 20px 10px rgba(0,0,0,0.1)',
		borderRadius: '50px',
	},
});

export default function FriendsNavBottom({ myAccount }) {
	const router = useRouter();
	const classes = useStyles();
	const [value, setValue] = React.useState('friends');

	const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		setValue(newValue);
	};
	const onClick = () => {
		setValue('signOut');
		setTimeout(() => {
			confirm('로그아웃하시겠습니까?')
				? authService.signOut()
				: setTimeout(() => {
						setValue('friends');
				  }, 300);
		}, 300);
	};

	return (
		<div>
			<BottomNavigation value={value} onChange={handleChange} className={classes.root}>
				<BottomNavigationAction
					label='친구'
					value='friends'
					style={{ transform: 'translateY(4px)' }}
					icon={<PeopleAltRoundedIcon />}></BottomNavigationAction>

				<BottomNavigationAction
					onClick={() => {
						router.push('/chats');
					}}
					label='채팅'
					value='chats'
					style={{ transform: 'translateY(4px)' }}
					icon={<ChatRoundedIcon />}></BottomNavigationAction>

				<BottomNavigationAction
					onClick={onClick}
					label='로그아웃'
					value='signOut'
					style={{ transform: 'translateY(4px)' }}
					icon={<LockRoundedIcon />}
				/>
			</BottomNavigation>
		</div>
	);
}

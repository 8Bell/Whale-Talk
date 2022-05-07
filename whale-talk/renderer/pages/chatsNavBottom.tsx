import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { authService } from './fbase';
import Link from '../components/Link';

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
				label='친구'
				value='friends'
				icon={<PeopleAltRoundedIcon />}
				href='/friends'>
				<Link href='/friends' as='/friends' />
			</BottomNavigationAction>

			<BottomNavigationAction
				label='채팅'
				value='chats'
				icon={<ChatRoundedIcon />}
				href='/chats'>
				<Link href='/chats' as='/chats' />
			</BottomNavigationAction>

			<BottomNavigationAction
				onClick={onClick}
				label='더보기'
				value='more'
				icon={<MenuRoundedIcon />}
			/>
		</BottomNavigation>
	);
}
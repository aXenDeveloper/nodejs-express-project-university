import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserShield, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { useCSRF } from '../../context/csrf';

const NavItems = () => {
	const { tokenCSRF } = useCSRF();

	return (
		<>
			<li>
				<NavLink exact to="/">
					<FontAwesomeIcon icon={faHome} /> Home
				</NavLink>
			</li>

			<li>
				<NavLink exact to="/contact">
					<FontAwesomeIcon icon={faPhoneAlt} /> Contact
				</NavLink>
			</li>
			{tokenCSRF && (
				<li>
					<NavLink exact to="/admin">
						<FontAwesomeIcon icon={faUserShield} /> Admin
					</NavLink>
				</li>
			)}
		</>
	);
};

export default NavItems;

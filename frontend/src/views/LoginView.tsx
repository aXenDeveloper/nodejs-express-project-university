import { useState, useEffect, FC, ChangeEvent, FormEvent, useRef, MutableRefObject } from 'react';
import { useCSRF } from '../context/csrf';
import config from '../config';

const LoginView: FC = () => {
	const [inputEmail, setInputEmail] = useState<string>('');
	const [inputPassword, setInputPassword] = useState<string>('');

	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const { createTokenCSRF }: any = useCSRF();

	const _isMounted: MutableRefObject<boolean> = useRef(true);

	useEffect(() => {
		document.title = `${config.title_page} - Login`;

		return () => {
			_isMounted.current = false;
		};
	}, []);

	const api = async () => {
		try {
			setLoading(true);
			const api = await fetch(`${config.backend_url}/account/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: inputEmail,
					password: inputPassword
				})
			});

			const data = await api.json();
			console.log(data);

			if (api.status === 200) {
				createTokenCSRF(data.CSRF_token);
			} else if (api.status === 400) {
				setErrorMessage(data.message);
			}

			setLoading(false);
		} catch (err) {
			console.error(err);
		}
	};

	const formSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		api();
	};

	const handleEmail = (e: ChangeEvent<HTMLInputElement>) => setInputEmail(e.target.value);
	const handlePassword = (e: ChangeEvent<HTMLInputElement>) => setInputPassword(e.target.value);

	return (
		<div className="container">
			{loading ? (
				<div className="loading"></div>
			) : (
				<div className="flex flex-ai:center flex-jc:center">
					<div className="container_box container_box:small padding:large">
						{errorMessage && <div className="message message-error">{errorMessage}</div>}

						<form className="form" onSubmit={formSubmit}>
							<ul className="form_ul">
								<li>
									<input
										type="email"
										className="input input_text input_full"
										placeholder="Email Address"
										onChange={handleEmail}
										value={inputEmail}
									/>
								</li>
								<li>
									<input
										type="password"
										className="input input_text input_full"
										placeholder="Password"
										onChange={handlePassword}
										value={inputPassword}
									/>
								</li>
							</ul>

							<div className="flex flex-jc:center margin-top">
								<button className="button button_primary button_full" type="submit">
									Login
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default LoginView;
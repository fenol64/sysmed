
"use client"
import axios from 'axios';
import md5 from 'md5';
import React, { useState } from 'react';

function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		const payload = {
			email,
			passwd: md5(password),
		}

		try {
			const res = await axios.get('/api/user', {params: payload});

			if (remember) {
				localStorage.setItem('user', JSON.stringify(res.data));
			}

			if (res.data.length === 1) {
				alert('Login efetuado com sucesso');
				delete res.data[0].passwd;
				localStorage.setItem('user', JSON.stringify(res.data[0]));
				window.location.href = '/app';
			} else {
				throw new Error('Usuário ou senha inválidos');
			}
		} catch(err) {
			if (err.response?.data?.error) {
				alert(err.response.data.error);
			} else {
				alert('Erro ao efetuar login');
			}
		}

	}

	return (
		<div className="d-flex flex-column justify-content-center align-items-center" style={{height: "100vh" }}>
			<h2 className="text-center">
				<i class="fa-solid fa-stethoscope me-3" />
				SysMed
			</h2>
			<div className="container" style={{maxWidth: "500px"}}>
				<form onSubmit={handleSubmit} className='row g-3'>
					<div className="col-12">
						<label htmlFor="email">Email:</label>
						<input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
					</div>
					<div className="col-12">
						<label htmlFor="pwd">Senha:</label>
						<input type="password" className="form-control" id="pwd" value={password} onChange={e => setPassword(e.target.value)} required />
					</div>
					<div className="col-12">
						<div className="form-group form-check">
							<label className="form-check-label">
								<input className="form-check-input" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Lembrar-me
							</label>
						</div>
					</div>
					<div className="col-12">
						<button type="submit" className="btn btn-primary w-100">
							{loading ? <i className="fa-solid fa-spinner fa-spin me-2" /> : null}
							Entrar
						</button>
					</div>
					<p className="text-center">
						não tem uma conta? <a href="/register">crie uma</a>
					</p>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;
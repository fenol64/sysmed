
"use client"
import axios from 'axios';
import md5 from 'md5';
import React, { useState } from 'react';

function LoginPage() {
	const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
    const payoad = {
      name,
      email,
      passwd: md5(password),
    }

    try {
    const res = await axios.post('/api/user', payoad);
      alert('Usuário cadastrado com sucesso');
      window.location.href = '/';
    } catch(err) {
        if (err.response?.data?.error) {
          alert(err.response.data.error);
        } else {
          alert('Erro ao cadastrar usuário');
        }
      } finally {
        setLoading(false);
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
						<label htmlFor="name">nome:</label>
						<input type="name" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} required />
					</div>
					<div className="col-12">
						<label htmlFor="email">Email:</label>
						<input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
					</div>
					<div className="col-12">
						<label htmlFor="pwd">Senha:</label>
						<input type="password" className="form-control" id="pwd" value={password} onChange={e => setPassword(e.target.value)} required />
					</div>
					<div className="col-12">
						<button type="submit" className="btn btn-primary w-100">
							{loading ? <i className="fa-solid fa-spinner fa-spin me-2" /> : null}
							Entrar
						</button>
					</div>
					<p className="text-center">
						Já tem uma conta? <a href="/">Entrar</a>
					</p>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;
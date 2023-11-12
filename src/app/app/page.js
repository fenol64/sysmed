"use client";
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import { Container } from './styles';

const formatDate = (appointment_date) => {
    const date  = appointment_date.split('T');
    console.log(date)
    const date_parts = date[0].split('-');
    const time_parts = date[1].split(':');
    return `${date_parts[2]}/${date_parts[1]}/${date_parts[0]} ${time_parts[0]}:${time_parts[1]}`;
}

function app() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [appointment, setAppointment] = useState({});

    const modal_ref = useRef();

    const saveAppointment = () => {

        const payload = {};
        payload.uuid = uuidv4();
        payload.user_id = user.id;
        payload.pacient_document = appointment.pacient_document;
        payload.pacient_name = appointment.pacient_name;
        payload.appointment_date = `${appointment.appointment_date} ${appointment.appointment_time}`;


        setLoading(true);
        fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            alert('Consulta cadastrada com sucesso!');
            location.reload();
        })
        .catch((error) => {
            alert('Erro ao cadastrar consulta!');
        });
    }

    const getAppointments = (user_id) => {
        setLoading(true);
        fetch(`http://localhost:3000/api/appointments?user_id=${user_id ?? user.id}`)
        .then(response => response.json())
        .then(data => {
            setLoading(false);
            console.log(data)
            setAppointments(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        setLoading(true);
        const user_data = localStorage.getItem('user');
        if (user_data) {
            setLoading(false);
            const user_parsed = JSON.parse(user_data);
            setUser(user_parsed);
            getAppointments(user_parsed.id);
        } else {
            window.location.href = '/login';
        }
    }, []);

  return <main>
    <nav className="navbar bg-body-tertiary">
        <div className="container">
            <div>
            <i className="fa-solid fa-stethoscope me-2" />
            <a className="navbar-brand">SysMed</a>
            </div>
            <div className="d-flex" role="search">
            <button className="btn btn-outline-danger" type="submit" onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/';
            }}>Sair</button>
            </div>
        </div>
    </nav>
    <div className="container">
        {loading ? <div className="text center spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div> : <>
        <div className="my-3 row">
            <div className="col-12 col-md-9">
                <h4>Bem vindo, {user.name}</h4>
            </div>
            <div className="col-12 col-md-3">
                <div className="d-flex justify-content-end">
                <button className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#newAppointment">Nova consulta</button>
            </div>
            </div>
            <div className="my-3 card">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Documento do paciente</th>
                            <th scope="col">Nome do paciente</th>
                            <th scope="col">Data e hora da consulta</th>
                        </tr>
                    </thead>
                    <tbody>

                        {appointments.length > 0 && appointments.map(appointment => <tr key={appointment.id}>
                            <td>{appointment.pacient_document}</td>
                            <td>{appointment.pacient_name}</td>
                            <td>{formatDate(appointment.appointment_date)}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>

        </div>
        </>}
    </div>
    <div ref={modal_ref} className="modal fade" id="newAppointment" tabIndex={-1} aria-labelledby="newAppointmentLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="newAppointmentLabel">Nova consulta</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
                <form>
                <div className="row">
                    <div className="col-12 col-md-6">
                    <div className="mb-3">
                        <label htmlFor="pacient_document" className="form-label">Documento do paciente</label>
                        <input type="text" className="form-control" id="pacient_document" value={appointment.pacient_document} onChange={e => setAppointment({ ...appointment, pacient_document: e.target.value })} required/>
                    </div>
                    </div>
                    <div className="col-12 col-md-6">
                    <div className="mb-3">
                        <label htmlFor="pacient_name" className="form-label">Nome do paciente</label>
                        <input type="text" className="form-control" id="pacient_name" value={appointment.pacient_name} onChange={e => setAppointment({ ...appointment, pacient_name: e.target.value })} required/>
                    </div>
                    </div>
                    <div className="col-12 col-md-6">
                    <div className="mb-3">
                        <label htmlFor="appointment_date" className="form-label">Data da consulta</label>
                        <input type="date" className="form-control" id="appointment_date" value={appointment.appointment_date} onChange={e => setAppointment({ ...appointment, appointment_date: e.target.value })} required/>
                    </div>
                    </div>
                    <div className="col-12 col-md-6">
                    <div className="mb-3">
                        <label htmlFor="appointment_time" className="form-label">Hora da consulta</label>
                        <input type="time" className="form-control" id="appointment_time" value={appointment.appointment_time} onChange={e => setAppointment({ ...appointment, appointment_time: e.target.value })} required/>
                        </div>
                        </div>
                </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" className="btn btn-primary" onClick={saveAppointment}>Salvar</button>
            </div>
            </div>
        </div>
    </div>

  </main>;
}

export default app;
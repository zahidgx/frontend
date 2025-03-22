import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

const UsuarioForm = ({ usuario, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        password: '',
        fechaNacimiento: '',
        rol: 'usuario'
    });

    // Cargar los datos del usuario si existe
    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || '',
                apellido_paterno: usuario.apellido_paterno || '',
                apellido_materno: usuario.apellido_materno || '',
                email: usuario.email || '',
                fechaNacimiento: usuario.fechaNacimiento || '',
                rol: usuario.rol || 'usuario'
            });
        }
    }, [usuario]);

    // Manejar el cambio de valores en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejar el submit del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (usuario && usuario._id) {
                // Si estamos actualizando, no enviamos el campo 'password'
                const { password, ...usuarioData } = formData;
                await axios.put(`http://localhost:5000/api/usuarios/${usuario._id}`, usuarioData);

                alert("Usuario actualizado correctamente");
            } else {
                // Si es un nuevo usuario, enviamos 'password'
                await axios.post('http://localhost:5000/api/auth/register', formData);
                alert("Usuario agregado correctamente");
            }
            onSave();  // Llamar la función onSave para actualizar la lista de usuarios
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            alert('Hubo un error al guardar el usuario.');
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <h2 className="text-center">{usuario ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Apellido Paterno</Form.Label>
                    <Form.Control type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Apellido Materno</Form.Label>
                    <Form.Control type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                {!usuario && (
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </Form.Group>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Select name="rol" value={formData.rol} onChange={handleChange}>
                        <option value="usuario">Usuario</option>
                        <option value="admin">Admin</option>
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">{usuario ? 'Actualizar' : 'Registrar'}</Button>
            </Form>
        </Container>
    );
};

export default UsuarioForm;

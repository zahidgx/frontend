import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UsuarioForm from './UsuarioForm';
import { Navbar, Nav, Button } from 'react-bootstrap'; 
import { Link } from 'react-router-dom'; 

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Obtener usuarios al montar el componente
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const filteredUsers = usuarios.filter(usuario =>
    Object.values(usuario).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleDelete = async (_id) => {
    console.log("ID al eliminar:", _id);  // Verificar el valor de `_id`
    if (!_id) {
      console.error("ID no válido al eliminar");
      return;
    }
  
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:5000/api/usuarios/${_id}`);
        // Actualizamos la lista de usuarios después de eliminar
        setUsuarios(prevUsuarios => prevUsuarios.filter(u => u._id !== _id));
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };
    

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsAdding(true);
  };

  const handleSave = () => {
    obtenerUsuarios(); // Refrescar la lista después de agregar o editar
    setEditingUser(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setIsAdding(false);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      obtenerUsuarios();
      alert('Usuarios importados correctamente.');
    } catch (error) {
      console.error('Error al importar usuarios:', error);
      alert('Error al importar usuarios.');
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/export-excel', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'usuarios.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al exportar usuarios:', error);
    }
  };

  return (
    <div style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://source.unsplash.com/1600x900/?technology,sound")', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', width: '100vw', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
        <Navbar.Brand className="fs-3 fw-bold text-primary">SoundAlertIA</Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center">
          <Link to="/profile">
            <Button variant="outline-light" className="me-2">Perfil</Button>
          </Link>
          <Link to="/dispositivos">
            <Button variant="outline-light" className="me-2">Dispositivos</Button>
          </Link>
          <Link to="/alertas">
            <Button variant="outline-light" className="me-2">Alertas</Button>
          </Link>
          <Link to="/login">
            <Button variant="danger" className="me-2">Cerrar Sesión</Button>
          </Link>
        </Nav>
      </Navbar>

      <h2>Lista de Usuarios</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        {!isAdding && !editingUser && (
          <>
            <button className="btn btn-primary" onClick={handleAdd}>Agregar Usuario</button>
            <input type="file" accept=".xlsx" onChange={handleImport} className="ms-3" />
            <button className="btn btn-success ms-3" onClick={handleExport}>Exportar a Excel</button>
          </>
        )}
      </div>

      {(isAdding || editingUser) && (
        <div className="mt-4">
          <UsuarioForm usuario={editingUser} onSave={handleSave} />
          <button className="btn btn-secondary ms-3" onClick={handleCancel}>Cancelar</button>
        </div>
      )}

      {paginatedUsers.length === 0 ? (
        <p>No se encontraron usuarios.</p>
      ) : (
        <>
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Email</th>
                <th>Fecha de Nacimiento</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((usuario) => (
                <tr key={usuario._id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido_paterno}</td>
                  <td>{usuario.apellido_materno}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toLocaleDateString() : 'N/A'}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEdit(usuario)}>Editar</button>
                    <button className="btn btn-danger ms-2" onClick={() => handleDelete(usuario._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UsuarioList;

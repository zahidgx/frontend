import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DispositivoForm = ({ dispositivo, onSave }) => {
  const [formData, setFormData] = useState({
    dispositivo_id: '',
    usuario_id: '',
    ubicacion: '',
    estado: 'activo',
    ultima_reporte: '', // Asegúrate de que el valor esté en formato ISO 8601 para la fecha.
  });

  useEffect(() => {
    if (dispositivo) {
      setFormData({
        dispositivo_id: dispositivo.dispositivo_id || '',
        usuario_id: dispositivo.usuario_id || '',
        ubicacion: dispositivo.ubicacion || '',
        estado: dispositivo.estado || 'activo',
        ultima_reporte: dispositivo.ultima_reporte || '', // Asegúrate de que la fecha esté bien formateada.
      });
    }
  }, [dispositivo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dispositivo) {
      // Editar dispositivo
      try {
        await axios.put(`http://localhost:5000/api/dispositivos/${dispositivo._id}`, formData);
        onSave();
      } catch (error) {
        console.error('Error al editar dispositivo:', error);
      }
    } else {
      // Crear nuevo dispositivo
      try {
        // Asegúrate de que no envíes el _id para la creación
        const { _id, ...newFormData } = formData;

        // Asegúrate de que el campo ultima_reporte tenga el formato correcto
        if (newFormData.ultima_reporte) {
          newFormData.ultima_reporte = new Date(newFormData.ultima_reporte).toISOString();
        }

        await axios.post('http://localhost:5000/api/dispositivos', newFormData);
        onSave();
      } catch (error) {
        console.error('Error al agregar dispositivo:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="dispositivo_id" className="form-label">ID Dispositivo</label>
        <input
          type="text"
          className="form-control"
          id="dispositivo_id"
          name="dispositivo_id"
          value={formData.dispositivo_id}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="usuario_id" className="form-label">ID Usuario</label>
        <input
          type="text"
          className="form-control"
          id="usuario_id"
          name="usuario_id"
          value={formData.usuario_id}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="ubicacion" className="form-label">Ubicación</label>
        <input
          type="text"
          className="form-control"
          id="ubicacion"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="estado" className="form-label">Estado</label>
        <select
          className="form-control"
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="ultima_reporte" className="form-label">Último Reporte</label>
        <input
          type="datetime-local"
          className="form-control"
          id="ultima_reporte"
          name="ultima_reporte"
          value={formData.ultima_reporte}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {dispositivo ? 'Guardar Cambios' : 'Agregar Dispositivo'}
      </button>
    </form>
  );
};

export default DispositivoForm;

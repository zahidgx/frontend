import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const AlertaForm = ({ alerta, onSave }) => {
  const [formData, setFormData] = useState({
    tipo_sonido: "",
    nivel_sonido: "",
    texto_icono: "",
    dispositivo_id: "",
    ubicacion: "",
    notificacion: false, // Campo booleano
    fecha_hora: "", // Campo de fecha y hora
  });

  useEffect(() => {
    if (alerta) {
      setFormData({
        tipo_sonido: alerta.tipo_sonido || "",
        nivel_sonido: alerta.nivel_sonido || "",
        texto_icono: alerta.texto_icono || "",
        dispositivo_id: alerta.dispositivo_id || "",
        ubicacion: alerta.ubicacion || "",
        notificacion: alerta.notificacion || false,
        fecha_hora: alerta.fecha_hora || "", // Asignamos el valor de fecha y hora
      });
    }
  }, [alerta]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, notificacion: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (alerta && alerta._id) {
        await axios.put(`https://3.145.88.225/api/alertas/${alerta._id}`, formData);
        alert("Alerta actualizada correctamente");
      } else {
        await axios.post("https://3.145.88.225/api/alertas/", formData);
        alert("Alerta agregada correctamente");
      }
      onSave();
    } catch (error) {
      console.error("Error al guardar la alerta:", error);
      alert("Error al guardar la alerta");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <h2 className="text-center">{alerta ? "Editar Alerta" : "Nueva Alerta"}</h2>

        <Form.Group className="mb-3">
          <Form.Label>Tipo de Sonido</Form.Label>
          <Form.Control 
            type="text" 
            name="tipo_sonido" 
            value={formData.tipo_sonido} 
            onChange={handleChange} 
            placeholder="Tipo de sonido" 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nivel de Sonido</Form.Label>
          <Form.Control 
            type="text" 
            name="nivel_sonido" 
            value={formData.nivel_sonido} 
            onChange={handleChange} 
            placeholder="Nivel de sonido" 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Texto Icono</Form.Label>
          <Form.Control 
            type="text" 
            name="texto_icono" 
            value={formData.texto_icono} 
            onChange={handleChange} 
            placeholder="Texto Icono" 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ID del Dispositivo</Form.Label>
          <Form.Control 
            type="text" 
            name="dispositivo_id" 
            value={formData.dispositivo_id} 
            onChange={handleChange} 
            placeholder="ID del dispositivo" 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ubicación</Form.Label>
          <Form.Control 
            type="text" 
            name="ubicacion" 
            value={formData.ubicacion} 
            onChange={handleChange} 
            placeholder="Ubicación" 
            required 
          />
        </Form.Group>

        {/* Campo de notificación como un checkbox */}
        <Form.Group className="mb-3">
          <Form.Check 
            type="checkbox" 
            name="notificacion" 
            label="Notificación Activada" 
            checked={formData.notificacion} 
            onChange={handleCheckboxChange}
          />
        </Form.Group>

        {/* Campo de fecha y hora */}
        <Form.Group className="mb-3">
          <Form.Label>Fecha y Hora</Form.Label>
          <Form.Control 
            type="text" 
            name="fecha_hora" 
            value={formData.fecha_hora} 
            onChange={handleChange} 
            placeholder="Fecha y Hora" 
            required 
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          {alerta ? "Actualizar" : "Guardar"}
        </Button>
      </Form>
    </Container>
  );
};

export default AlertaForm;

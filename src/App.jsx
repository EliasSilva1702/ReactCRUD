import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");

  const peticionGet = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    peticionGet();
  }, []);

  const handleEdit = (post) => {
    setCurrentPost(post);
    setEditedTitle(post.title);
    setEditedBody(post.body);
    setModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setData(data.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/posts/${currentPost.id}`, {
        ...currentPost,
        title: editedTitle,
        body: editedBody
      });
      setData(data.map((post) =>
        post.id === currentPost.id
          ? { ...post, title: editedTitle, body: editedBody }
          : post
      ));
      setModal(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const toggleModal = () => setModal(!modal);

  return (
    <div className="App">
      <table>
        <thead>
          <tr className="trhead">
            <th>ID</th>
            <th>Título</th>
            <th>Cuerpo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {data.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
              <td className="btns">
                <button onClick={() => handleEdit(post)}>Editar</button>
                <button onClick={() => handleDelete(post.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Editar Post</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Título"
          />
          <Input
            type="textarea"
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            placeholder="Cuerpo"
            style={{
              height: "10rem",
              marginTop: "2rem",
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>Guardar</Button>
          <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;

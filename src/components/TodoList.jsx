import React, { useState, useEffect } from "react";
import "./styles/TodoList.css";
import "./styles/ConfirmationModal.css";
import RealTimeClock from "./RealTimeClock";
import ConfirmationModal from "./ConfirmationModal";

const TodoList = () => {
  const [list, setList] = useState([]);
  const [newList, setNewList] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationMessageDelete, setConfirmationMessageDelete] =
    useState("");
  const [taskToDelete, setTaskToDelete] = useState(null); // Estado para almacenar la tarea que se va a eliminar

  // Cargar tareas desde localStorage al cargar el componente
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("todoList")) || [];
    setList(savedList);
  }, []);

  // Guardar lista en localStorage cada vez que cambie
  useEffect(() => {
    try {
      localStorage.setItem("todoList", JSON.stringify(list));
    } catch (error) {
      localStorage.removeItem("todoList");
      console.log(error);
    }
  }, [list]);

  const addOrSaveTask = () => {
    if (newList.trim() === "") return;

    if (editingId !== null) {
      // Guardar cambios en una tarea existente
      const updatedList = list.map((task) =>
        task.id === editingId
          ? {
              ...task,
              description: newList,
              comment: editComment,
              time: new Date().toLocaleString(),
            }
          : task
      );
      setNewList("");
      setList(updatedList);
      setConfirmationMessage("¡Tarea actualizada!");
      setTimeout(() => setConfirmationMessage(""), 2000);
      cancelEdit();
    } else {
      const newTask = {
        id: Date.now(),
        description: newList,
        comment: "",
        done: false,
        time: new Date().toLocaleString(),
      };
      setNewList("");
      setList([newTask, ...list]);
      setConfirmationMessage("¡Tarea agregada!");
      setTimeout(() => setConfirmationMessage(""), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (editingId !== null) {
        // Si estamos editando, guardar
        addOrSaveTask(editingId);
      } else {
        // Si no estamos editando, agregar la tarea
        addOrSaveTask();
      }
    }
  };

  const deleteBtn = (taskId) => {
    setTaskToDelete(taskId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setList(list.filter((task) => task.id !== taskToDelete));
    setShowModal(false);
    setTaskToDelete(null);

    setConfirmationMessageDelete("¡Tarea eliminada!"); // Mostrar mensaje de confirmación
    // Ocultar el mensaje después de 2 segundos
    setTimeout(() => {
      setConfirmationMessageDelete("");
    }, 2000);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setTaskToDelete(null);
  };

  const cancelDeleteAllCompleted = () => {
    setShowDeleteAllModal(false);
  };

  const confirmDeleteAllCompleted = () => {
    const completedCount = list.filter((task) => task.done).length;

    if (completedCount > 0) {
      setList(list.filter((task) => !task.done));
      setConfirmationMessageDelete(`${completedCount} tareas eliminadas.`);
      // Ocultar el mensaje después de 2 segundos
      setTimeout(() => {
        setConfirmationMessageDelete("");
      }, 2000);
    }

    setShowDeleteAllModal(false);
  };

  const toggleDone = (taskId) => {
    const updatedList = list.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );
    setList(updatedList);
  };

  const startEditing = (task) => {
    setNewList(task.description);
    setEditingId(task.id);
    setEditText(task.description);
    setEditComment(task.comment || "");
  };

  const cancelEdit = () => {
    setNewList("");
    setEditingId(null);
  };

  const deleteCompletedTasks = () => {
    setList(list.filter((task) => !task.done));
  };

  return (
    <div>
      {confirmationMessage && (
        <p className="confirmation-message">
          <span className="span-add">✔</span>
          {confirmationMessage}
        </p>
      )}
      {confirmationMessageDelete && (
        <p className="confirmation-message-delete">
          <span className="span-delete">🗑️</span>
          {confirmationMessageDelete}
        </p>
      )}
      {confirmationMessageDelete && (
        <p className="confirmation-message-delete">
          <span className="span-delete">🗑️</span>
          {confirmationMessageDelete}
        </p>
      )}
      <div className="card-todo-list">
        <div className="container-top">
          <div className="flex">
            <RealTimeClock />
            <h1>Crear nueva tarea</h1>
          </div>
          <div className="container-btn-input">
            <input
              className="input-search"
              type="text"
              placeholder="Escribe tu tarea..."
              value={newList}
              onChange={(e) => setNewList(e.target.value)}
              onKeyDown={handleKeyPress} //Detectamos el presionado de la tecla Enter
            />

            <div className="container-btn">
              <button
                className={
                  newList.length >= 3 ? "btn-add" : "button-add-pending"
                }
                onClick={addOrSaveTask}
                disabled={newList.length < 3}
              >
                {editingId ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
          <div className="flex-edit">
            {editingId && (
              <textarea
                className="textarea-comen"
                placeholder="Añade un comentario..."
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
              />
            )}

            <div>
              {editingId && (
                <button className="btn-cancel" onClick={cancelEdit}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container-bottom">
          <section className="section">
            {list.length === 0 ? (
              <>
                <p className="pPending">No tienes nada pendiente.</p>
                <div>
                  <hr />
                </div>
                {/* <div className="imgTodoList"></div> */}
              </>
            ) : (
              <>
                <div className="pending-header">
                  <p className="p-tareas">
                    Mis tareas pendientes (
                    {list.filter((task) => !task.done).length})
                  </p>
                  <button
                    className={
                      list.some((task) => task.done) && !editingId
                        ? "btn-delete-completed"
                        : "button-delete-pending"
                    }
                    onClick={() => setShowDeleteAllModal(true)}
                    disabled={
                      !list.some((task) => task.done) || editingId !== null
                    }
                  >
                    Eliminar completadas
                    {list.filter((task) => task.done).length > 0 &&
                      ` (${list.filter((task) => task.done).length})`}
                  </button>
                </div>
                {list.map((task) => (
                  <div
                    key={task.id}
                    className={`li-container ${
                      task.done ? "task-completed" : ""
                    }`}
                  >
                    {task.done && <span className="check-icon">✔</span>}
                    <p className={task.done ? "task-done" : "none"}>
                      {task.description}
                    </p>
                    <p className="pTime">{task.time}</p>
                    {task.comment && (
                      <div className="container-coment">
                        <hr />
                        <p className="pComment">Comentario:</p>
                        <p className={task.done ? "coment-done" : "p-coment"}>
                          "{task.comment}"
                        </p>
                      </div>
                    )}
                    <button
                      className={
                        editingId
                          ? "button-edit-pending"
                          : task.done
                          ? "btn-delete"
                          : "btn-delete"
                      }
                      onClick={() => deleteBtn(task.id)}
                      disabled={!!editingId}
                    >
                      Eliminar
                    </button>
                    <button
                      className={
                        editingId || task.done
                          ? "button-edit-pending"
                          : "btn-edit"
                      }
                      onClick={() => startEditing(task)}
                      disabled={!!editingId || task.done}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toggleDone(task.id)}
                      className={
                        editingId
                          ? "button-edit-pending"
                          : task.done
                          ? "btn-finish"
                          : "button-finish-pending"
                      }
                      disabled={!!editingId}
                    >
                      {task.done ? "Terminado" : "Terminar"}
                    </button>
                  </div>
                ))}
              </>
            )}
          </section>

          {showModal && (
            <ConfirmationModal
              message="¿Estás seguro de que deseas eliminar esta tarea?"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
          {showDeleteAllModal && (
            <ConfirmationModal
              message="¿Estás seguro de que deseas eliminar todas las tareas completadas?"
              onConfirm={confirmDeleteAllCompleted}
              onCancel={cancelDeleteAllCompleted}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;

import { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import './todo.css';

const Todo = () => {
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [items, setItems] = useState([
    { id: "001", name: "Default Task", desc: "Default Description", time: "12:00", status: false, completedTime: null },
  ]);
  const [filter, setFilter] = useState("all");
  const [showTasks, setShowTasks] = useState(false);  // New state to toggle task visibility

  const handleInput = (e) => setInputTitle(e.target.value);
  const handleInputDesc = (e) => setInputDesc(e.target.value);
  const handleInputTime = (e) => setInputTime(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputTitle || !inputDesc || !inputTime) {
      alert("Please fill all fields");
    } else {
      const newItem = {
        id: new Date().getTime().toString(),
        name: inputTitle,
        desc: inputDesc,
        time: inputTime,  // 24-hour format (e.g., 14:30)
        status: false,
        completedTime: null
      };
      setItems([newItem, ...items]);
      setInputTitle("");
      setInputDesc("");
      setInputTime("");
    }
  };

  const handleDelete = (id) => {
    const updatedItems = items.filter((elem) => elem.id !== id);
    setItems(updatedItems);
  };

  const handleStatusToggle = (id) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const currentTime = new Date().toTimeString().substring(0, 5); // Current time in "HH:MM" format
        if (currentTime <= item.time) {
          return { ...item, status: true, completedTime: currentTime };
        }
      }
      return item;
    });
    setItems(updatedItems);
  };

  const filterItems = (type) => setFilter(type);

  const getStatus = (item) => {
    const currentTime = new Date().toTimeString().substring(0, 5); // Current time in "HH:MM" format
    if (item.status) {
      return "Completed";
    } else if (currentTime > item.time) {
      return "Incomplete";
    }
    return ""; // Default no status
  };

  const filteredItems = items.filter((item) => {
    const currentTime = new Date().toTimeString().substring(0, 5);
    if (filter === "completed") return item.status;
    if (filter === "pending") return !item.status && currentTime < item.time;
    if (filter === "incomplete") return !item.status && currentTime >= item.time;
    return true;
  });

  return (
    <Container className="my-4">
      <Row>
        <Col md={6} className="mx-auto">
          <div className="center">
            <h1>Add Task</h1>
            <Form onSubmit={handleSubmit}>
              <div className="inputbox">
                <input type="text" required="required" value={inputTitle} onChange={handleInput} />
                <span>Task Title</span>
              </div>
              <div className="inputbox">
                <input type="text" required="required" value={inputDesc} onChange={handleInputDesc} />
                <span>Task Description</span>
              </div>
              <div className="inputbox">
                <input type="time" required="required" value={inputTime} onChange={handleInputTime} />
              </div>
              <div className="inputbox">
                <input type="submit" value="Submit" />
              </div>
            </Form>
            <Button className="mt-2" onClick={() => setShowTasks(!showTasks)}>
              {showTasks ? "Hide Tasks" : "View Tasks"}
            </Button>
          </div>
        </Col>
      </Row>

      {showTasks && (
        <Row className="mt-4">
          <Col>
            <h2 className="text-center">To-Do List</h2>
            <div className="mb-4 text-center   task-buttons">
              <Button
                variant="primary"
                onClick={() => filterItems("all")}
                className="mx-1 btn-sm"
              >
                All Tasks ({items.length})
              </Button>
              <Button
                variant="warning"
                onClick={() => filterItems("pending")}
                className="mx-1 btn-sm"
              >
                Pending ({items.filter(item => !item.status && new Date().toTimeString().substring(0, 5) < item.time).length})
              </Button>
              <Button
                variant="danger"
                onClick={() => filterItems("incomplete")}
                className="mx-1 btn-sm"
              >
                Incomplete ({items.filter(item => !item.status && new Date().toTimeString().substring(0, 5) >= item.time).length})
              </Button>
              <Button
                variant="success"
                onClick={() => filterItems("completed")}
                className="mx-1 btn-sm"
              >
                Completed ({items.filter(item => item.status).length})
              </Button>
            </div>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`task-container ${item.status ? 'bg-light text-dark' : 'bg-light'}`}
              >
                <h4>{item.name}</h4>
                <p>{item.desc}</p>
                <p>Time: {item.time}</p>
                {getStatus(item) && <p>Status: {getStatus(item)}</p>}
                {!item.status && new Date().toTimeString().substring(0, 5) <= item.time && (
                  <Button
                    variant="primary"
                    onClick={() => handleStatusToggle(item.id)}
                    className="btn-sm"
                  >
                    Mark as Complete
                  </Button>
                )}
                <Button
                  variant="danger"
                  className="ms-2 btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Todo;

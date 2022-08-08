import useScreen from "../hooks/useScreen";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useApi from "../hooks/useApi";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Checkbox } from "@mui/material";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import "../index.css";
import Loader from "./loader";
import toast, { Toaster } from "react-hot-toast";

const Home = () => {
  useScreen();
  const api = useApi();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todo");

  const location = useLocation();
  console.log(location.state);
  if (location?.state?.msg) {
    toast.success(location.state.msg);
    location.state.msg = undefined;
  }

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };

  const { data: todos, isLoading: isLoadingTodos } = useQuery(
    ["todos"],
    async () => await api.get("todos"),
    {
      onError: (err) => console.error(err),
    }
  );

  const { mutateAsync: updateTodo, isLoading: isLoadingUpdateTodo } =
    useMutation(
      async ({ id, todo, completed }) => {
        console.log("runs");
        return await api.put(`todos/${id}`, {
          todo: todo,
          completed: completed,
        });
      },
      {
        onSuccess: (res) => {
          console.log("res", res);
          queryClient.invalidateQueries("todos");
        },
        onError: (err) => console.log(err),
      }
    );

  const { mutateAsync: deleteTodo, isLoading: isDeletingTodo } = useMutation(
    async (id) => await api.delete(`todos/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries("todos"),
      onError: (err) => console.error(err),
    }
  );

  const isLoading = isDeletingTodo || isLoadingTodos || isLoadingUpdateTodo;

  const filterTodos = (todos) =>
    todos?.filter(({ todo }) =>
      search.length > 0
        ? todo.toLowerCase().includes(search.toLowerCase())
        : true
    );

  const pendingTodos = todos?.data?.filter(
    ({ completed }) => completed === false
  );
  const completedTodos = todos?.data?.filter(({ completed }) => completed);

  const filteredTodos = filterTodos(
    selectedStatus === "todo" ? pendingTodos : completedTodos
  );

  const tableRows = filteredTodos?.map((todo) => (
    <TableRow id={todo.id}>
      <TableCell align="center">
        <Checkbox
          checked={todo.completed}
          onClick={async () =>
            await updateTodo({ id: todo.id, completed: !todo.completed })
          }
        />
      </TableCell>
      <TableCell align="center">{todo.todo}</TableCell>
      <TableCell align="center">{moment(todo.created_at).fromNow()}</TableCell>
      <TableCell align="center">
        <IconButton
          aria-label="delete"
          onClick={async () => await deleteTodo(todo.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ));

  return (
    <>
      <Loader isLoading={isLoading} />
      <Toaster />
      <div className="mainContainer">
        <div className="container">
          <input
            className="searchTodos"
            name="search"
            value={search}
            placeholder="Search Todos"
            onChange={(e) => setSearch(e.target.value)}
            style={{ margin: 10 }}
          />
          <div className="headerContainer">
            <div className="statusContainer">
              <div
                className="statusSelector"
                style={{
                  color: selectedStatus === "todo" ? "#008cff" : "grey",
                  top: selectedStatus === "todo" ? 1.5 : 1,
                  height: selectedStatus === "todo" ? 52 : 50,
                  borderBottom:
                    selectedStatus === "todo"
                      ? "none"
                      : "1.5px solid #008cffa6",
                }}
                onClick={() => setSelectedStatus("todo")}
              >
                To Do
              </div>
              <div
                className="statusSelector"
                onClick={() => setSelectedStatus("completed")}
                style={{
                  color: selectedStatus === "completed" ? "#008cff" : "grey",
                  top: selectedStatus === "completed" ? 1.5 : 1,
                  height: selectedStatus === "completed" ? 52 : 50,
                  borderBottom:
                    selectedStatus === "completed"
                      ? "none"
                      : "1.5px solid #008cffa6",
                }}
              >
                Completed
              </div>
            </div>
            <div className="buttonContainer">
              <button
                className="loginButton"
                style={{ marginRight: 5 }}
                onClick={() => navigate("/create")}
              >
                Create Todo
              </button>
              <button className="loginButton" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          <TableContainer
            component={Paper}
            style={{
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              border: "1.5px solid #008cffa6",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {filteredTodos?.length > 0 ? (
                    <>
                      <TableCell align="center">Completed</TableCell>
                      <TableCell align="center">Todo</TableCell>
                      <TableCell align="center">Created At</TableCell>
                      <TableCell align="center"></TableCell>
                    </>
                  ) : (
                    <TableCell align="center">Nothing Here</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default Home;

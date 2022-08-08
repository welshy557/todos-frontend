import "../index.css";
import useAuth from "../hooks/useAuth";
import useScreen from "../hooks/useScreen";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";
import { useMutation, useQueryClient } from "react-query";

const CreateTodo = () => {
  useScreen();
  const queryClient = useQueryClient();
  const api = useApi();
  const navigate = useNavigate();
  const { mutateAsync: createTodo, isLoading } = useMutation(
    async (todo) => await api.post("todos", { todo: todo }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
        navigate("/home", {
          state: { msg: "Successfully Created Todo" },
        });
      },
      onError: (err) => console.error(err),
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createTodo(e.target.todo.value);
  };
  return (
    <>
      <Loader isLoading={isLoading} />
      <div className="mainContainer">
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="title">Create Todo</div>
            <label className="label" htmlFor="todo">
              Todo
            </label>
            <input
              className="emailInput"
              type="text"
              name="todo"
              title="Todo"
            />

            <button className="loginButton" type="submit">
              Create Todo
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTodo;

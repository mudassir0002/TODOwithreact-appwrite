import React, { useState, useEffect } from 'react';
import { account, databases } from '../appwrite/config';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const [todo, setTodo] = useState('');
    const [email, setEmail] = useState('');
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await account.get();
                setEmail(user.email);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const fetchTodos = async () => {
        try {
            const response = await databases.listDocuments(
                import.meta.env.VITE_APP_DB_ID,
                import.meta.env.VITE_APP_COLLECTION_ID
            );
            setTodos(response.documents);
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const addTodo = async () => {
        if (todo.trim() === '') {
            setError('Please enter a valid TODO item.');
            return;
        }
        setError('');
        setSuccess('');
        try {
            const response = await databases.createDocument(
                import.meta.env.VITE_APP_DB_ID,
                import.meta.env.VITE_APP_COLLECTION_ID,
                'unique()',
                { email : email
                    , todo : todo }
            );
            setTodos((prevTodos) => [...prevTodos, response]);
            setSuccess('Todo added successfully!');
            setTodo('');
        } catch (err) {
            console.error('Error adding todo:', err);
            setError('Failed to add todo.');
        }
    };

    const editTodo = async (id, updatedText) => {
        try {
            const response = await databases.updateDocument(
                import.meta.env.VITE_APP_DB_ID,
                import.meta.env.VITE_APP_COLLECTION_ID,
                id,
                { todo: updatedText }
            );
            setTodos((prevTodos) =>
                prevTodos.map((item) =>
                    item.$id === id ? { ...item, todo: response.todo } : item
                )
            );
            setEditId(null);
            setEditText('');
            setSuccess('Todo updated successfully!');
        } catch (err) {
            console.error('Error editing todo:', err);
            setError('Failed to update todo.');
        }
    };

    const deleteTodo = async (id) => {
        try {
            await databases.deleteDocument(
                import.meta.env.VITE_APP_DB_ID,
                import.meta.env.VITE_APP_COLLECTION_ID,
                id
            );
            setTodos((prevTodos) => prevTodos.filter((item) => item.$id !== id));
            setSuccess('Todo deleted successfully!');
        } catch (err) {
            console.error('Error deleting todo:', err);
            setError('Failed to delete todo.');
        }
    };

    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            navigate('/login');
        } catch (err) {
            console.error('Error logging out:', err.message || err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Welcome to the Dashboard</h1>
            <p className="text-center mb-6 text-gray-700">Logged in as: {email}</p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2 w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Add your TODO"
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={addTodo}
                        className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Add Todo
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Logout
                </button>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Todos:</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {todos.map((item) => (
                        <div
                            key={item.$id}
                            className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                        >
                            {editId === item.$id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        onClick={() => editTodo(item.$id, editText)}
                                        className="mt-2 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditId(null)}
                                        className="mt-2 ml-2 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-800">{item.todo}</p>
                                    <button
                                        onClick={() => {
                                            setEditId(item.$id);
                                            setEditText(item.todo);
                                        }}
                                        className="mt-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTodo(item.$id)}
                                        className="mt-2 ml-2 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {todos.length === 0 && (
                        <p className="text-gray-500 text-center col-span-full">No todos added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

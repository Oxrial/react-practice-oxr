import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/login'
import Home from '@/pages/home'
const routes = [
	{
		path: '/',
		element: <Navigate to="/home" replace />
	},
	{
		path: '/login',
		element: <Login />
	},
	{
		path: '/home',
		element: <Home />
	}
]

export default createBrowserRouter(routes)

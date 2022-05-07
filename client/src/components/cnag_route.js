// https://ncoughlin.com/posts/react-navigation-without-react-router/
const Route = ({ path, children }) => {
	return window.location.pathname === path ? children : null
      }
      
      export default Route
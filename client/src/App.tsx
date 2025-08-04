// import { BrowserRouter } from "react-router-dom";
// import {
//   ApolloClient,
//   ApolloProvider,
//   InMemoryCache,
//   createHttpLink,
// } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";

// import { AuthProvider } from "./authRoutes";
// import { AuthRoutes } from "./authRoutes";

// // ---------------------------------------------
// // Apollo Client setup
// // ---------------------------------------------
// // Point this at your GraphQL endpoint; override with Vite env var when deploying.
// const httpLink = createHttpLink({
//   uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
// });

// // Inject the JWT from localStorage, if present.
// const authLink = setContext((_, { headers }) => {
//   const raw = localStorage.getItem("session");
//   const token: string | null = raw ? JSON.parse(raw).token : null;
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// // ---------------------------------------------
// // Root component
// // ---------------------------------------------
// function App() {
//   return (
//     <ApolloProvider client={client}>
//       <AuthProvider>
//         <BrowserRouter>
//           <AuthRoutes />
//         </BrowserRouter>
//       </AuthProvider>
//     </ApolloProvider>
//   );
// }

// export default App;

import Navbar from './components/Navbar';
import Books from "./components/Books";
import Home from "./components/Home";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => (
  <div style={{ maxWidth: 1800 }}>
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home message="Welcome to the Bible" />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
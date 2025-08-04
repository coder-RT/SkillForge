import { useState, useContext, createContext, ReactNode } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Navigate, useNavigate, Routes, Route, Link } from "react-router-dom";

// ---------------------------
// GraphQL documents
// ---------------------------
const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      token
      roles
      defaultRole
    }
  }
`;

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      roles
      defaultRole
    }
  }
`;

const POST_REQUIREMENT = gql`
  mutation PostRequirement($title: String!, $description: String!) {
    postRequirement(title: $title, description: $description) {
      id
      title
      description
      createdAt
    }
  }
`;

const LIST_MY_REQUIREMENTS = gql`
  query MyRequirements {
    myRequirements {
      id
      title
      description
      comments {
        id
        body
        authorId
      }
    }
  }
`;

const LIST_OPEN_REQUIREMENTS = gql`
  query OpenRequirements {
    openRequirements {
      id
      title
      description
      studentId
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($requirementId: ID!, $body: String!) {
    addComment(requirementId: $requirementId, body: $body) {
      id
      body
      requirementId
      authorId
    }
  }
`;

// ---------------------------
// Auth context & provider
// ---------------------------
interface Session {
  token: string;
  roles: string[]; // ["student", "mentor"]
  currentRole: string;
}

const AuthContext = createContext<{
  session: Session | null;
  setSession: (s: Session | null) => void;
  switchRole: (role: string) => void;
}>({
  session: null,
  setSession() {},
  switchRole() {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSessionState] = useState<Session | null>(() => {
    const raw = localStorage.getItem("session");
    return raw ? JSON.parse(raw) : null;
  });

  const setSession = (s: Session | null) => {
    setSessionState(s);
    if (s) localStorage.setItem("session", JSON.stringify(s));
    else localStorage.removeItem("session");
  };

  const switchRole = (role: string) => {
    if (!session) return;
    const updated = { ...session, currentRole: role };
    setSession(updated);
  };

  return (
    <AuthContext.Provider value={{ session, setSession, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ---------------------------
// Register page
// ---------------------------
export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [register, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      const { token, roles, defaultRole } = data.registerUser;
      setSession({ token, roles, currentRole: defaultRole });
      navigate("/dashboard");
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ variables: { input: { ...form } } });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Create your account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          placeholder="Name"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          placeholder="Email"
          type="email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          placeholder="Password"
          type="password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="input"
        >
          <option value="student">Student (default)</option>
          <option value="mentor">Mentor</option>
        </select>
        <button className="btn w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
      </p>
    </div>
  );
};

// ---------------------------
// Login page
// ---------------------------
export const LoginPage = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      const { token, roles, defaultRole } = data.login;
      setSession({ token, roles, currentRole: defaultRole });
      navigate("/dashboard");
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { ...form } });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          placeholder="Email"
          type="email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          placeholder="Password"
          type="password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </form>
      <p className="mt-4 text-center text-sm">
        Need an account? <Link to="/register" className="text-blue-600">Sign up</Link>
      </p>
    </div>
  );
};

// ---------------------------
// Role switcher dropdown
// ---------------------------
const RoleSwitcher = () => {
  const { session, switchRole } = useAuth();
  if (!session) return null;
  return (
    <select
      value={session.currentRole}
      onChange={(e) => switchRole(e.target.value)}
      className="input w-40"
    >
      {session.roles.map((r) => (
        <option key={r} value={r}>
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </option>
      ))}
    </select>
  );
};

// ---------------------------
// Student requirements UI
// ---------------------------
const StudentRequirements = () => {
  const { session } = useAuth();
  const { data, refetch } = useQuery(LIST_MY_REQUIREMENTS, { skip: !session });
  const [form, setForm] = useState({ title: "", description: "" });
  const [post, { loading: posting }] = useMutation(POST_REQUIREMENT, {
    onCompleted() {
      setForm({ title: "", description: "" });
      refetch();
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post({ variables: { ...form } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My Requirements</h2>

      <form onSubmit={submit} className="space-y-2">
        <input
          required
          placeholder="Short title"
          className="input w-full"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          required
          placeholder="Describe your need..."
          className="input w-full h-24"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="btn" disabled={posting}>Post Requirement</button>
      </form>

      <ul className="space-y-4">
        {data?.myRequirements.map((req: any) => (
          <li key={req.id} className="border p-4 rounded-xl">
            <h3 className="font-medium">{req.title}</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{req.description}</p>
            <div className="mt-2 space-y-1">
              {req.comments.map((c: any) => (
                <p key={c.id} className="text-xs bg-gray-100 rounded p-2">
                  {c.body}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------
// Mentor board UI
// ---------------------------
const MentorBoard = () => {
  const { data, refetch } = useQuery(LIST_OPEN_REQUIREMENTS);
  const [commentText, setCommentText] = useState("");
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [addComment, { loading: commenting }] = useMutation(ADD_COMMENT, {
    onCompleted() {
      setCommentText("");
      setSelectedReq(null);
      refetch();
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    addComment({ variables: { requirementId: selectedReq, body: commentText } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Open Requirements</h2>
      <ul className="space-y-4">
        {data?.openRequirements.map((req: any) => (
          <li key={req.id} className="border p-4 rounded-xl">
            <h3 className="font-medium">{req.title}</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{req.description}</p>
            <button
              className="btn-sm mt-2"
              onClick={() => setSelectedReq(req.id)}
            >
              Respond
            </button>
          </li>
        ))}
      </ul>

      {selectedReq && (
        <form onSubmit={submit} className="space-y-2 border p-4 rounded-xl">
          <textarea
            required
            placeholder="Your response..."
            className="input w-full h-24"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="btn" disabled={commenting}>Send Reply</button>
        </form>
      )}
    </div>
  );
};

// ---------------------------
// Dashboard + routes
// ---------------------------
const Dashboard = () => {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {session.currentRole === "student" ? <StudentRequirements /> : <MentorBoard />}
      </div>
      <div className="fixed top-4 right-4">
        <RoleSwitcher />
      </div>
    </div>
  );
};

export const AuthRoutes = () => (
  <Routes>
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
);

// ---------------------------
// Helper: input & button classes are shorthand for Tailwind styles.
// Replace or adjust if you're not using Tailwind.
// .input { @apply border p-2 rounded-lg w-full }
// .btn   { @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:brightness-110 }
// .btn-sm{ @apply btn px-2 py-1 text-sm }

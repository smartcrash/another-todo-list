import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useCurrentUserQuery } from "./generated/graphql";
import Loading from "./pages/loading";
import { routes } from "./routes";

const loadable = (factory: Parameters<typeof lazy>[0]) => () => {
  const Component = lazy(factory);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Component />
    </Suspense>
  );
};

const Login = loadable(() => import("./pages/login"));
const SignUp = loadable(() => import("./pages/sign-up"));
const Dashboard = loadable(() => import("./pages/dashboard"));
const Project = loadable(() => import("./pages/project"));

function App() {
  const [{ data, fetching }] = useCurrentUserQuery();
  const user = !!data?.currentUser;

  return (
    <Router>
      <Routes>
        {fetching ? (
          <Route path="*" element={<Loading />} />
        ) : user ? (
          <>
            <Route path={routes.index} element={<Dashboard />}>
              <Route path={routes.project} element={<Project />} />
            </Route>
            <Route path="*" element={<Navigate to={routes.index} replace />} />
          </>
        ) : (
          <>
            <Route path={routes.login} element={<Login />} />
            <Route path={routes.signUp} element={<SignUp />} />
            <Route path="*" element={<Navigate to={routes.login} replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

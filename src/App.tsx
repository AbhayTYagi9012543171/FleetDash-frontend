import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#1e293b",
            color: "#fff",
          },
        }}
      />

      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
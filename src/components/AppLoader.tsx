import { useAuth } from "@/contexts/AuthContext";

export const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  return (
    <>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(to right, #fb923c, #facc15)',
          zIndex: 9999,
          boxShadow: '0 0 10px rgba(251, 146, 60, 0.5)'
        }} />
      )}
      {children}
    </>
  );
};
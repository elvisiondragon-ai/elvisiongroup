import { useAuth } from "@/contexts/AuthContext";

export const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <img
          src="/loader.png"
          alt="Loading..."
          style={{
            width: '150px',
            height: '150px',
            animation: 'pulse 2s infinite'
          }}
        />
        <div style={{
          marginTop: '20px',
          fontSize: '18px',
          background: 'linear-gradient(to right, #fb923c, #facc15)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '600',
          textShadow: '0 0 15px rgba(251, 146, 60, 0.4)'
        }}>
          🚀 Initiate Ecosystem..
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};
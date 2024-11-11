function Login() {
  const server_sock = import.meta.env.VITE_SERVER_SOCK;
  return (
    <div className="App">
      <header className="App-header">
        <a className="btn-spotify" href={server_sock + "/auth/login"}>
          Login with Spotify to Listen
        </a>
      </header>
    </div>
  );
}

export default Login;

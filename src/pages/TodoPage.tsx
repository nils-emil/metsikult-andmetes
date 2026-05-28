export function TodoPage() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <a className="back-btn" href="#/">← Tagasi</a>
          <h1 className="title">Loomade vaade</h1>
          <p className="subtitle">
            Siin tuleb peagi vaade metsa elanike perspektiivist — kuidas raie
            mõjutab elupaiku, varjualust ja toidubaasi.
          </p>
        </div>
      </header>

      <div className="panel todo-panel">
        <div className="todo-emoji" aria-hidden>🦌</div>
        <h2>TODO</h2>
        <p>See vaade on alles tegemisel.</p>
      </div>
    </div>
  );
}

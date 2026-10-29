const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem('theme-storage');
    var state = raw ? JSON.parse(raw)?.state : null;
    var theme = state && state.hasExplicitPreference
      ? state.theme
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}

import './globals.css';
export const metadata = { title: 'Digital Sanctuary', description: 'A 3D room for my diary, data and media.' };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}</body></html>);
}

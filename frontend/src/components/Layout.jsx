import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <main className="container mx-auto px-4 md:px-8 py-6">
                {children}
            </main>
        </div>
    );
}

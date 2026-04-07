import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
                {children}
            </main>
            <footer className="border-t border-border bg-card mt-auto py-20 md:py-28">
                <div className="max-w-5xl mx-auto w-full px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-2 items-center md:items-start select-none">
                        <span className="font-display font-bold text-xl tracking-tight">InsightPress<span className="text-accent">.</span></span>
                        <p className="text-muted-foreground text-sm">Empowering voices, one story at a time.</p>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground font-medium">
                        <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                        <a href="#" className="hover:text-accent transition-colors">Terms</a>
                        <a href="#" className="hover:text-accent transition-colors">About</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

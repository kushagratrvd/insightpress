import { Link } from 'react-router-dom';
import { PenTool } from 'lucide-react';
import { Button } from './ui';

export default function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
            <div className="ml-7 container flex h-16 items-center justify-between">
                <div className="ml-2 flex gap-2 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">InsightPress</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/write">
                        <Button size="sm" className="gap-2">
                            <PenTool size={16} />
                            Write
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Layout from '../components/Layout';
import { Badge } from '../components/ui';
import { Clock, Eye, User } from 'lucide-react';

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/blogs');
            setBlogs(response.data);
        } catch (error) {
            console.error('Failed to fetch blogs', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <Link to={`/blog/${blog._id}`} key={blog._id} className="group block">
                        <article className="flex flex-col space-y-3 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-card text-card-foreground">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold leading-tight tracking-tight group-hover:underline decoration-primary decoration-2 underline-offset-4">
                                    {blog.title}
                                </h2>
                                <Badge variant="secondary" className="shrink-0">{blog.sentiment}</Badge>
                            </div>
                            <p className="text-muted-foreground line-clamp-3 text-sm">
                                {blog.summary || blog.content.substring(0, 150) + "..."}
                            </p>
                            <div className="flex items-center justify-between pt-4 mt-auto text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User size={14} />
                                    <span>{blog.authorName}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {blog.readingTime && (
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            <span>{blog.readingTime}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Eye size={14} />
                                        <span>{blog.views}</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
                {blogs.length === 0 && (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        <p>No blogs found. Be the first to write one!</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

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
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-12 text-center space-y-6">
                <div className="inline-flex items-center gap-2 border border-accent/30 bg-accent/5 px-4 py-2 rounded-full animate-float">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse-soft"></span>
                    <span className="font-mono text-xs tracking-widest text-accent uppercase">
                        Latest Insights
                    </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">
                    Explore <span className="gradient-text">New Horizons</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Dive into our hand-picked collection of thoughts, tutorials, and stories tailored just for you.
                </p>
            </div>

            <div className="flex flex-col gap-8">
                {blogs.map((blog) => (
                    <Link to={`/blog/${blog._id}`} key={blog._id} className="group block">
                        <article className="flex flex-col md:flex-row bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden group-hover:border-accent/40 relative z-10 w-full min-h-[250px]">
                            <div className="md:w-5/12 bg-muted/20 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border relative overflow-hidden">
                                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-accent/5 rounded-full blur-2xl transition-all group-hover:bg-accent/10"></div>
                                <Badge variant="gradient" className="w-fit mb-4">{blog.sentiment}</Badge>
                                <h2 className="text-3xl font-bold font-display leading-tight tracking-tight group-hover:text-accent transition-colors">
                                    {blog.title}
                                </h2>
                            </div>
                            <div className="md:w-7/12 p-8 flex flex-col">
                                <div className="text-muted-foreground leading-relaxed text-base mb-8 flex-grow">
                                    <p className="line-clamp-3">
                                        {(() => {
                                            let text = blog.summary || blog.content || "";
                                            text = text.replace(/<[^>]+>/g, ' '); // Replace HTML with space
                                            text = text.replace(/[*_~`#]+/g, ''); // Remove common markdown
                                            text = text.replace(/\s+/g, ' ').trim(); // Fix whitespace
                                            return text.length > 250 ? text.substring(0, 250) + "..." : text;
                                        })()}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-border/50 text-foreground/80 mt-auto">
                                    <div className="flex items-center gap-3 font-medium">
                                        <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-xs text-white font-bold shadow-sm">
                                            {blog.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-base">{blog.authorName}</span>
                                    </div>
                                    <div className="flex items-center gap-6 text-muted-foreground text-sm">
                                        {blog.readingTime && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-accent/70" />
                                                <span>{blog.readingTime}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Eye size={16} className="text-accent/70" />
                                            <span>{blog.views}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
                
                {blogs.length === 0 && (
                    <div className="w-full text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
                        <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 text-accent rounded-full flex items-center justify-center animate-pulse-soft">
                            <Eye size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
                        <p className="text-muted-foreground mb-6">Be the first to share your thoughts with the world.</p>
                        <Link to="/write">
                            <button className="bg-accent-gradient text-white px-6 py-3 rounded-xl shadow-sm hover:shadow-accent transition-all duration-200 hover:-translate-y-0.5 font-medium">
                                Write an Article →
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import Layout from '../components/Layout';
import { Badge, Button, Input } from '../components/ui';
import DOMPurify from 'dompurify';
import { Clock, Eye, User, Trash2, Edit } from 'lucide-react';
import { createPortal } from 'react-dom';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    const [key, setKey] = useState('');

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                <h3 className="text-lg font-semibold">Delete Blog</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Enter the Edit Key to confirm deletion. This action cannot be undone.
                </p>
                <Input
                    type="password"
                    placeholder="Enter Edit Key"
                    className="mt-4"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                />
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={() => onConfirm(key)}>Delete</Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);

    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await api.get(`/blogs/${id}`);
            setBlog(response.data);
        } catch (error) {
            console.error('Failed to fetch blog', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (key) => {
        try {
            await api.delete(`/blogs/${id}`, { data: { editKey: key } });
            navigate('/');
        } catch (error) {
            alert('Failed to delete blog. Invalid Key?');
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </Layout>
    );

    if (!blog) return null;

    return (
        <Layout>
            <article className="max-w-3xl mx-auto space-y-8">
                <header className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{blog.sentiment}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock size={14} /> {blog.readingTime}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Eye size={14} /> {blog.views}
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{blog.title}</h1>
                    <div className="flex items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User size={16} />
                            <span>{blog.authorName}</span>
                            <span>•</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                            <Link to={`/edit/${blog._id}`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Edit size={14} /> Edit
                                </Button>
                            </Link>
                            <Button variant="destructive" size="sm" className="gap-2" onClick={() => setShowDelete(true)}>
                                <Trash2 size={14} /> Delete
                            </Button>
                        </div>
                    </div>
                </header>

                {blog.summary && (
                    <div className="rounded-lg bg-muted/50 p-6 border border-border/50">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                            ✨ AI Summary
                        </h3>
                        <p className="text-muted-foreground italic leading-relaxed">
                            {blog.summary}
                        </p>
                    </div>
                )}

                <div
                    className="prose prose-slate dark:prose-invert max-w-full"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
                />
            </article>

            <DeleteModal
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
            />
        </Layout>
    );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Layout from '../components/Layout';
import { Button, Input } from '../components/ui';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Save, Loader2, Sparkles } from 'lucide-react';

export default function WriteBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        authorName: '',
        editKey: ''
    });
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(isEditing);
    const [aiResult, setAiResult] = useState({ type: '', content: '' });

    useEffect(() => {
        if (isEditing) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await api.get(`/blogs/${id}`);
            const { title, content, authorName } = response.data;
            setFormData({ title, content, authorName, editKey: '' });
        } catch (error) {
            console.error('Failed to fetch blog', error);
            navigate('/');
        } finally {
            setInitializing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/blogs/${id}`, formData);
            } else {
                await api.post('/blogs/', formData);
            }
            navigate('/');
        } catch (error) {
            alert('Operation failed. Check your Edit Key or network connection.');
        } finally {
            setLoading(false);
        }
    };

    if (initializing) {
        return (
            <Layout>
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">{isEditing ? 'Edit Blog' : 'Write New Blog'}</h1>
                        <p className="text-muted-foreground">
                            {isEditing ? 'Update your thoughts using your secret key.' : 'Share your ideas with the world.'}
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title</label>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter an engaging title"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Author Name</label>
                                <Input
                                    name="authorName"
                                    value={formData.authorName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    disabled={isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {isEditing ? 'Verify Edit Key' : 'Create Edit Key'}
                                </label>
                                <Input
                                    type="password"
                                    name="editKey"
                                    value={formData.editKey}
                                    onChange={handleChange}
                                    placeholder="Secret Passphrase"
                                    required
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    {isEditing ? 'Required to save changes.' : 'You will need this to edit or delete later.'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Content</label>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={async () => {
                                        if (!formData.title) return alert("Please enter a title first!");
                                        setLoading(true);
                                        try {
                                            const res = await api.post('/ai/generate_outline', { text: formData.title });
                                            setAiResult({ type: 'Outline', content: res.data.result });
                                        } catch (e) { alert("Failed to generate outline"); }
                                        setLoading(false);
                                    }}>
                                        <Sparkles className="h-3 w-3 mr-1" /> Outline
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={async () => {
                                        if (!formData.content) return alert("Write some content first!");
                                        setLoading(true);
                                        try {
                                            // Sending HTML to backend is fine, or simple text. 
                                            // For polishing, we ideally want the text. 
                                            // Editor state is in formData.content (HTML).
                                            // Let's send the HTML as 'text' and hope the AI handles it or we strip tags?
                                            // AI models are good at HTML usually.
                                            const res = await api.post('/ai/polish_content', { text: formData.content });
                                            setAiResult({ type: 'Polished Content', content: res.data.result });
                                        } catch (e) { alert("Failed to polish content"); }
                                        setLoading(false);
                                    }}>
                                        <Sparkles className="h-3 w-3 mr-1" /> Polish
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const res = await api.post('/ai/generate_suggestions', { text: formData.content });
                                            setAiResult({ type: 'Suggestions', content: res.data.result });
                                        } catch (e) { alert("Failed to get suggestions"); }
                                        setLoading(false);
                                    }}>
                                        <Sparkles className="h-3 w-3 mr-1" /> Tips
                                    </Button>
                                </div>
                            </div>
                            <div className="min-h-[400px]">
                                <SimpleEditor
                                    value={formData.content}
                                    onChange={(newContent) => setFormData(prev => ({ ...prev, content: newContent }))}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                                {isEditing ? 'Update Blog' : 'Publish Blog'}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1 space-y-4">
                    <div className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm h-full sticky top-24">
                        <div className="flex items-center gap-2 mb-4 border-b pb-4">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <h2 className="font-semibold text-lg">AI Assistant</h2>
                        </div>

                        {!aiResult.content ? (
                            <div className="text-muted-foreground text-sm text-center py-10">
                                <p>Select a tool above to get help from AI.</p>
                                <p className="mt-2 text-xs">Generate outlines, polish your drafts, or get writing tips.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium text-primary">{aiResult.type}</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setAiResult({ type: '', content: '' })}>Clear</Button>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                                    {aiResult.content}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" className="w-full border" onClick={() => {
                                        navigator.clipboard.writeText(aiResult.content);
                                        alert("Copied directly to clipboard!");
                                    }}>
                                        Copy
                                    </Button>
                                    <Button size="sm" className="w-full" onClick={() => {
                                        if (aiResult.type === 'Outline') {
                                            setFormData(prev => ({ ...prev, content: prev.content + "\n\n" + aiResult.content }));
                                        } else {
                                            setFormData(prev => ({ ...prev, content: aiResult.content }));
                                        }
                                    }}>
                                        {aiResult.type === 'Outline' ? 'Append' : 'Replace Draft'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

import { useState, useEffect } from 'react';
import { User, MessageCircle, Reply, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Comment } from '@/types/novel';

interface CommentSectionProps {
  chapterId: string;
}

export default function CommentSection({ chapterId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

  // Load comments from localStorage (simulating backend)
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${chapterId}`);
    if (savedComments) {
      const parsed = JSON.parse(savedComments).map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
      setComments(parsed);
    }
  }, [chapterId]);

  // Save comments to localStorage
  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`comments_${chapterId}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      chapterId,
      author: 'Leitor Anônimo',
      content: newComment.trim(),
      createdAt: new Date(),
    };

    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    setNewComment('');
    
    toast({
      title: 'Comentário adicionado',
      description: 'Seu comentário foi publicado com sucesso!',
    });
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: Date.now().toString(),
      chapterId,
      author: 'Leitor Anônimo',
      content: replyText.trim(),
      createdAt: new Date(),
      parentId,
    };

    const updatedComments = [...comments, reply];
    saveComments(updatedComments);
    setReplyText('');
    setReplyingTo(null);
    
    toast({
      title: 'Resposta adicionada',
      description: 'Sua resposta foi publicada com sucesso!',
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <section className="mt-12 pt-8 border-t border-border-subtle">
      <div className="flex items-center space-x-2 mb-8">
        <MessageCircle className="h-5 w-5 text-accent" />
        <h3 className="text-xl font-semibold text-content-primary">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="space-y-4">
          <Textarea
            placeholder="Compartilhe seus pensamentos sobre este capítulo..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" className="bg-accent hover:bg-accent-hover text-white">
              <Send className="h-4 w-4 mr-2" />
              Comentar
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-content-tertiary mx-auto mb-3" />
            <p className="text-content-secondary">
              Seja o primeiro a comentar este capítulo!
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => {
            const replies = getReplies(comment.id);
            
            return (
              <div key={comment.id} className="bg-surface border border-border-subtle rounded-lg p-6">
                {/* Main Comment */}
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-accent-light rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-medium text-content-primary">{comment.author}</p>
                      <span className="text-sm text-content-tertiary">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-content-primary whitespace-pre-wrap mb-3">
                      {comment.content}
                    </p>
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="inline-flex items-center text-sm text-accent hover:text-accent-hover"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Responder
                    </button>
                  </div>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <form 
                    onSubmit={(e) => handleSubmitReply(e, comment.id)}
                    className="mt-4 ml-14"
                  >
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Escreva sua resposta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-accent hover:bg-accent-hover text-white"
                        >
                          Responder
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {replies.length > 0 && (
                  <div className="mt-6 ml-14 space-y-4">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-accent-light rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-medium text-content-primary text-sm">{reply.author}</p>
                            <span className="text-xs text-content-tertiary">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-content-primary text-sm whitespace-pre-wrap">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
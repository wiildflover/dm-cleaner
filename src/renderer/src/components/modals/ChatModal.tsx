import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Users } from 'lucide-react'
import type { Friend } from '../../types'

interface ChatModalProps {
    show: boolean
    friend: Friend | null
    messages: any[]
    loading: boolean
    account: {
        id: string
        username: string
        globalName?: string
    }
    chatEndRef: React.RefObject<HTMLDivElement>
    onClose: () => void
}

export default function ChatModal({ show, friend, messages, loading, account, chatEndRef, onClose }: ChatModalProps) {
    if (!friend) return null

    return (
        <AnimatePresence>
            {show && (
                <div
                    className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#16161a] w-full max-w-2xl rounded-2xl border border-[#232328] overflow-hidden shadow-2xl flex flex-col h-[80vh]"
                    >
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[#232328] flex items-center justify-between bg-[#0e0e10]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#232328] overflow-hidden">
                                    {friend.user.avatar ? (
                                        <img
                                            src={`https://cdn.discordapp.com/avatars/${friend.user.id}/${friend.user.avatar}.png`}
                                            alt={friend.user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                            {friend.user.username[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        {friend.user.global_name || friend.user.username}
                                    </h2>
                                    <p className="text-xs font-medium text-slate-500">@{friend.user.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg hover:bg-[#232328] flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-[#16161a]">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-pulse">
                                    <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                                    <p className="text-sm">Loading conversation...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                    <Users className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">No messages found here.</p>
                                    <p className="text-xs mt-1 opacity-60">Say hello!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.author.id === account.id
                                    const showHeader = index === 0 || messages[index - 1].author.id !== msg.author.id

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                        >
                                            {showHeader && !isMe && (
                                                <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1">{msg.author.global_name || msg.author.username}</span>
                                            )}

                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe
                                                    ? 'bg-indigo-600 text-white rounded-br-sm'
                                                    : 'bg-[#232328] text-slate-200 rounded-bl-sm border border-[#2b2b30]'
                                                    }`}
                                            >
                                                {msg.content}

                                                {/* Image Attachments */}
                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div className="mt-2 space-y-2">
                                                        {msg.attachments.map((att: any) => (
                                                            <div key={att.id} className="rounded-lg overflow-hidden max-w-full">
                                                                <img src={att.url} alt="attachment" className="w-full h-auto max-h-60 object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[9px] text-slate-600 mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

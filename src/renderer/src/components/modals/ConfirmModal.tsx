import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface ConfirmModalProps {
    show: boolean
    count: number
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({ show, count, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-6 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#16161a] w-full max-w-md rounded-2xl border border-[#232328] overflow-hidden shadow-2xl"
                    >
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-rose-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
                                    <p className="text-xs text-slate-500">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="bg-[#0e0e10] rounded-xl p-4 mb-6 border border-rose-500/20">
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    You are about to delete <span className="font-bold text-white">{count}</span> conversation(s).
                                    All your messages in these conversations will be permanently removed.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-3 bg-[#1a1a1e] hover:bg-[#232328] border border-[#232328] rounded-xl text-slate-300 hover:text-white font-bold text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-rose-900/20"
                                >
                                    Delete All
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

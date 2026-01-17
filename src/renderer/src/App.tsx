/**
 * @file App.tsx
 * @author Wildflover
 * @description Main application component with blue gradient theme and background image
 * @language TypeScript/React
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogIn, ShieldAlert, X, Minus } from 'lucide-react'
import Dashboard from './Dashboard'
import iconImage from './assets/icon.png'
import appBgImage from './assets/app_bg.jpg'

interface DiscordAccount {
    id: string
    username: string
    discriminator: string
    globalName?: string
    avatar: string
    token: string
}

function App() {
    const [accounts, setAccounts] = useState<DiscordAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedAccount, setSelectedAccount] = useState<DiscordAccount | null>(null)
    const [showManualLogin, setShowManualLogin] = useState(false)
    const [manualToken, setManualToken] = useState('')
    const [manualLoginLoading, setManualLoginLoading] = useState(false)
    const [manualLoginError, setManualLoginError] = useState('')

    const selectAccount = (account: DiscordAccount) => {
        setSelectedAccount(account)
    }

    const handleManualLogin = async () => {
        if (!manualToken.trim()) {
            setManualLoginError('Please enter a token')
            return
        }
        setManualLoginLoading(true)
        setManualLoginError('')
        try {
            const response = await fetch('https://discord.com/api/v9/users/@me', {
                headers: { Authorization: manualToken.trim() }
            })
            if (response.ok) {
                const data = await response.json()
                const newAccount: DiscordAccount = {
                    id: data.id,
                    username: data.username,
                    discriminator: data.discriminator,
                    globalName: data.global_name,
                    avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : '',
                    token: manualToken.trim()
                }
                if (!accounts.find(acc => acc.id === newAccount.id)) {
                    setAccounts([...accounts, newAccount])
                }
                setShowManualLogin(false)
                setManualToken('')
            } else {
                setManualLoginError('Invalid token. Please check and try again.')
            }
        } catch (e) {
            setManualLoginError('Failed to validate token. Check your connection.')
        } finally {
            setManualLoginLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => { loadAccounts() }, 300)
        return () => clearTimeout(timer)
    }, [])

    const loadAccounts = async () => {
        const startTime = Date.now()
        try {
            console.log('[TOKEN-DISCOVERY] Starting token scan...')
            const tokens = await (window as any).api.discoverTokens()
            console.log(`[TOKEN-DISCOVERY] Found ${tokens.length} token(s)`)
            const fetchedAccounts: DiscordAccount[] = []
            for (const token of tokens) {
                try {
                    const response = await fetch('https://discord.com/api/v9/users/@me', {
                        headers: { Authorization: token }
                    })
                    if (response.ok) {
                        const data = await response.json()
                        console.log(`[ACCOUNT-FOUND] ${data.username}#${data.discriminator}`)
                        fetchedAccounts.push({
                            id: data.id,
                            username: data.username,
                            discriminator: data.discriminator,
                            globalName: data.global_name,
                            avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : '',
                            token
                        })
                    }
                } catch (e) {
                    console.error('[FETCH-ERROR] Failed to fetch profile:', e)
                }
            }
            setAccounts(fetchedAccounts)
            const elapsed = Date.now() - startTime
            if (elapsed < 500) await new Promise(r => setTimeout(r, 500 - elapsed))
        } catch (e) {
            console.error('[DISCOVERY-FAILED]', e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {selectedAccount ? (
                <Dashboard account={selectedAccount} onBack={() => setSelectedAccount(null)} />
            ) : (
                <div className="flex flex-col h-screen overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${appBgImage})` }} />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117]/90 via-[#161b22]/85 to-[#0d1117]/90" />
                    <div className="relative z-10 flex flex-col h-full border border-wf-blue-500/20">
                        <header className="h-8 w-full flex-shrink-0 flex items-center justify-between px-3 bg-[#0d1117]/80 backdrop-blur-md border-b border-wf-blue-500/10" style={{ WebkitAppRegion: 'drag' } as any}>
                            <div className="flex items-center gap-2">
                                <img src={iconImage} alt="Wildflover" className="w-4 h-4 rounded" />
                                <span className="text-xs font-bold bg-gradient-to-r from-wf-blue-400 to-wf-indigo-400 bg-clip-text text-transparent">Wildflover DM Cleaner</span>
                            </div>
                            <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as any}>
                                <button onClick={() => (window as any).api.minimize()} className="p-1 px-2.5 hover:bg-wf-blue-500/20 transition-colors text-slate-400 hover:text-wf-blue-400">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button onClick={() => (window as any).api.close()} className="p-1 px-2.5 hover:bg-red-500 transition-colors text-slate-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </header>
                        <main className="flex-1 flex overflow-hidden">
                            <BrandingSection />
                            <AccountPickerSection 
                                loading={loading} 
                                accounts={accounts} 
                                onSelect={selectAccount} 
                                onShowManualLogin={() => setShowManualLogin(true)} 
                            />
                        </main>
                        <ManualLoginModal 
                            show={showManualLogin}
                            token={manualToken}
                            loading={manualLoginLoading}
                            error={manualLoginError}
                            onTokenChange={setManualToken}
                            onLogin={handleManualLogin}
                            onClose={() => { setShowManualLogin(false); setManualToken(''); setManualLoginError('') }}
                        />
                        <footer className="h-10 px-6 flex items-center justify-between border-t border-wf-blue-500/10 bg-[#0d1117]/80 backdrop-blur-md">
                            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Version 1.0.0</div>
                            <span className="text-[9px] font-bold bg-gradient-to-r from-wf-blue-400 to-wf-indigo-400 bg-clip-text text-transparent uppercase tracking-widest">Dev by Wildflover</span>
                        </footer>
                    </div>
                </div>
            )}
        </>
    )
}

function BrandingSection() {
    return (
        <section className="w-1/3 flex flex-col items-center justify-center p-12 border-r border-wf-blue-500/10 bg-[#0d1117]/60 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 left-0 w-96 h-96 bg-wf-blue-600/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-wf-violet-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center relative z-10">
                {/* App Icon Container */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ duration: 0.6, delay: 0.2 }} 
                    className="relative mx-auto mb-8 w-36 h-36"
                >
                    {/* Rotating Outer Ring */}
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                        className="absolute -inset-3 rounded-[2.5rem] border-2 border-wf-blue-500/20 border-t-wf-blue-400"
                    />
                    
                    {/* Background Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-wf-blue-500/20 to-wf-violet-500/20 rounded-[2.5rem] blur-2xl" />
                    
                    {/* Icon Frame */}
                    <motion.div 
                        animate={{ scale: [1, 1.02, 1] }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-wf-blue-500/30 shadow-2xl shadow-wf-blue-900/40"
                    >
                        <img 
                            src={iconImage} 
                            alt="Wildflover" 
                            className="w-full h-full object-cover"
                            style={{ imageRendering: 'auto' }}
                        />
                        {/* Subtle Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-wf-blue-900/20 to-transparent pointer-events-none" />
                    </motion.div>
                    
                    {/* Floating Particles */}
                    <motion.div 
                        animate={{ y: [-8, 8, -8], opacity: [0.4, 0.8, 0.4] }} 
                        transition={{ duration: 3, repeat: Infinity }} 
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-wf-blue-400 rounded-full blur-[2px]"
                    />
                    <motion.div 
                        animate={{ y: [8, -8, 8], opacity: [0.4, 0.8, 0.4] }} 
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} 
                        className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-wf-violet-400 rounded-full blur-[2px]"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-wf-blue-400 via-wf-indigo-400 to-wf-violet-400 mb-2 tracking-tight">WILDFLOVER</h1>
                    <h2 className="text-2xl font-bold text-white tracking-wide">DM CLEANER</h2>
                </motion.div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-slate-400 text-sm leading-relaxed max-w-[240px] mx-auto mb-8">
                    Professional Discord message management tool. Fast, secure and easy to use.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-8">
                    <div className="text-center group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl group-hover:blur-2xl transition-all" />
                            <div className="relative text-2xl font-black text-emerald-400 group-hover:scale-110 transition-transform">100%</div>
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">Secure</div>
                    </div>
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-wf-blue-500/30 to-transparent" />
                    <div className="text-center group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-wf-blue-500/20 blur-xl group-hover:blur-2xl transition-all" />
                            <div className="relative text-2xl font-black text-wf-blue-400 group-hover:scale-110 transition-transform">FAST</div>
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">API V9</div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} className="mt-10 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-wf-blue-600/10 to-wf-violet-600/10 border border-wf-blue-500/20 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-400">Active & Updated</span>
                </motion.div>
            </motion.div>
        </section>
    )
}

interface AccountPickerProps {
    loading: boolean
    accounts: DiscordAccount[]
    onSelect: (acc: DiscordAccount) => void
    onShowManualLogin: () => void
}

function AccountPickerSection({ loading, accounts, onSelect, onShowManualLogin }: AccountPickerProps) {
    return (
        <section className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-[#0d1117]/40 backdrop-blur-sm">
            <div className="max-w-lg mx-auto">
                <header className="mb-10">
                    <h2 className="text-xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-500 text-sm">Select an account to start the cleaning process.</p>
                </header>
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-2 border-wf-blue-500/20 rounded-full" />
                                <div className="absolute top-0 w-16 h-16 border-2 border-wf-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-sm font-medium text-slate-400 animate-pulse">Scanning system data...</p>
                        </motion.div>
                    ) : (
                        <motion.div key="accounts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Available Sessions</div>
                            {accounts.length > 0 ? accounts.map((acc, i) => (
                                <motion.button key={acc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => onSelect(acc)} className="w-full glass-card p-4 flex items-center gap-4 text-left group transition-all duration-300 border border-wf-blue-500/10 hover:border-wf-blue-500/30 bg-[#161b22]/60 hover:bg-[#1c2128]/80">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-[#21262d] rounded-full flex items-center justify-center overflow-hidden border border-wf-blue-500/20">
                                            {acc.avatar ? <img src={acc.avatar} alt={acc.username} className="w-full h-full object-cover" /> : <User className="text-slate-400 w-6 h-6" />}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-discord-green border-[3px] border-[#161b22] rounded-full shadow-sm" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-base text-white group-hover:text-wf-blue-400 transition-colors truncate">{acc.globalName || acc.username}</div>
                                        <div className="text-xs font-medium text-slate-500">@{acc.username}</div>
                                    </div>
                                    <div className="w-9 h-9 rounded-lg bg-wf-blue-500/10 flex items-center justify-center text-wf-blue-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                        <LogIn className="w-4 h-4" />
                                    </div>
                                </motion.button>
                            )) : (
                                <div className="py-12 border-2 border-dashed border-wf-blue-500/10 rounded-2xl flex flex-col items-center justify-center text-center bg-[#161b22]/40">
                                    <ShieldAlert className="w-10 h-10 text-slate-600 mb-4" />
                                    <p className="text-slate-500 text-sm">No accounts found on this system.</p>
                                </div>
                            )}
                            <button onClick={onShowManualLogin} className="w-full mt-8 py-4 px-6 border border-wf-blue-500/20 rounded-2xl text-slate-400 hover:text-white hover:bg-wf-blue-500/10 hover:border-wf-blue-500/40 transition-all text-sm font-bold flex items-center justify-center gap-3">
                                <ShieldAlert className="w-4 h-4" />
                                MANUAL TOKEN LOGIN
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

interface ManualLoginModalProps {
    show: boolean
    token: string
    loading: boolean
    error: string
    onTokenChange: (v: string) => void
    onLogin: () => void
    onClose: () => void
}

function ManualLoginModal({ show, token, loading, error, onTokenChange, onLogin, onClose }: ManualLoginModalProps) {
    if (!show) return null
    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="glass-card p-8 max-w-md w-full mx-4 bg-[#161b22]/90 border-wf-blue-500/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-wf-blue-500/20 rounded-xl flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-wf-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Manual Token Login</h3>
                                <p className="text-xs text-slate-500">Enter your Discord token</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Discord Token</label>
                            <input type="password" value={token} onChange={(e) => onTokenChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !loading) onLogin() }} placeholder="Paste your token here..." className="w-full px-4 py-3 bg-[#0d1117]/80 border border-wf-blue-500/20 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-wf-blue-500/50 transition-colors font-mono text-sm" autoFocus />
                        </div>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-3 bg-discord-red/10 border border-discord-red/20 rounded-xl text-discord-red text-sm flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                        <div className="flex gap-3 pt-2">
                            <button onClick={onClose} className="flex-1 py-3 px-4 border border-wf-blue-500/20 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">Cancel</button>
                            <button onClick={onLogin} disabled={loading || !token.trim()} className="flex-1 py-3 px-4 bg-gradient-to-r from-wf-blue-600 to-wf-indigo-600 hover:from-wf-blue-500 hover:to-wf-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-all text-sm font-bold flex items-center justify-center gap-2">
                                {loading ? (<><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Validating...</>) : (<><LogIn className="w-4 h-4" />Login</>)}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default App

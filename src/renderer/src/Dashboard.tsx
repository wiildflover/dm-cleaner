/**
 * @file Dashboard.tsx
 * @author Wildflover
 * @description Main dashboard component with blue gradient theme
 * @language TypeScript/React
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Trash2, Loader2 } from 'lucide-react'

// Components
import Titlebar from './components/Titlebar'
import Sidebar from './components/Sidebar'
import DMListView from './components/DMListView'
import LogsView from './components/LogsView'
import SettingsView from './components/SettingsView'
import SummaryModal from './components/modals/SummaryModal'
import ChannelListModal from './components/modals/ChannelListModal'
import ConfirmModal from './components/modals/ConfirmModal'
import FriendsModal from './components/modals/FriendsModal'
import ChatModal from './components/modals/ChatModal'

// Background Image
import appBgImage from './assets/app_bg.jpg'

// Types
import type {
    DashboardProps,
    DMChannel,
    Friend,
    Stats,
    LogEntry,
    CleanedChannel,
    AppSettings,
    SummaryStats,
    CleaningProgress
} from './types'

/**
 * @file Dashboard.tsx
 * @author Wildflover
 * @description Main dashboard component with blue gradient theme
 * @language TypeScript/React
 */

export default function Dashboard({ account, onBack }: DashboardProps) {
    // State Management
    const [stats, setStats] = useState<Stats>({ friendCount: 0, dmCount: 0, groupDmCount: 0 })
    const [dmChannels, setDmChannels] = useState<DMChannel[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDMs, setSelectedDMs] = useState<Set<string>>(new Set())
    const [cleaning, setCleaning] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [cleaningProgress, setCleaningProgress] = useState<CleaningProgress>({ current: 0, total: 0, currentChannel: '' })
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [viewMode, setViewMode] = useState<'list' | 'logs'>('list')
    const [showSummary, setShowSummary] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [pendingCleanCount, setPendingCleanCount] = useState(0)
    const [showFriendsModal, setShowFriendsModal] = useState(false)
    const [friendsSearchQuery, setFriendsSearchQuery] = useState('')
    const [friendsList, setFriendsList] = useState<Friend[]>([])
    const [summaryStats, setSummaryStats] = useState<SummaryStats>({ total: 0, text: 0, images: 0, embeds: 0 })
    const [cleanedChannels, setCleanedChannels] = useState<CleanedChannel[]>([])
    const [showChannelListModal, setShowChannelListModal] = useState(false)
    const [activeTab, setActiveTab] = useState<'messages' | 'settings'>('messages')
    const [appSettings, setAppSettings] = useState<AppSettings>({
        deleteDelay: 600,
        batchSize: 100,
        autoRefresh: true,
        autoScroll: true,
        deleteAttachments: true,
        stopOnError: false
    })
    const [selectedChatFriend, setSelectedChatFriend] = useState<Friend | null>(null)
    const [chatMessages, setChatMessages] = useState<any[]>([])
    const [chatLoading, setChatLoading] = useState(false)

    const chatEndRef = useRef<HTMLDivElement>(null)
    const logEndRef = useRef<HTMLDivElement>(null)
    const stopRef = useRef(false)

    // Auto-scroll effects
    useEffect(() => {
        if (selectedChatFriend && chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [chatMessages, selectedChatFriend])

    useEffect(() => {
        if (viewMode === 'logs' && logEndRef.current && appSettings.autoScroll) {
            logEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [logs, viewMode, appSettings.autoScroll])

    // Load dashboard data
    useEffect(() => {
        loadDashboardData()

        const interval = setInterval(() => {
            if (!cleaning && !showFriendsModal) {
                loadDashboardData()
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [cleaning, showFriendsModal])

    const loadDashboardData = async () => {
        try {
            const friendsRes = await fetch('https://discord.com/api/v9/users/@me/relationships', {
                headers: { Authorization: account.token }
            })
            const friends = await friendsRes.json()

            const activeFriends = Array.isArray(friends) ? friends.filter((f: any) => f.type === 1) : []
            setFriendsList(activeFriends)

            const friendCount = activeFriends.length

            const userDataMap = new Map()
            if (Array.isArray(friends)) {
                friends.forEach((relation: any) => {
                    if (relation.user) {
                        userDataMap.set(relation.user.id, relation.user)
                    }
                })
            }

            const dmsRes = await fetch('https://discord.com/api/v9/users/@me/channels', {
                headers: { Authorization: account.token }
            })
            const dms = await dmsRes.json()

            if (Array.isArray(dms)) {
                const enrichedDMs = dms.map((dm) => {
                    if (dm.type === 1 && dm.recipients?.[0]) {
                        const userId = dm.recipients[0].id
                        const userData = userDataMap.get(userId)
                        const originalFlags = dm.recipients[0].public_flags || 0

                        if (userData) {
                            dm.recipients[0] = {
                                ...dm.recipients[0],
                                premium_type: userData.premium_type,
                                premium_since: userData.premium_since,
                                public_flags: userData.public_flags || originalFlags,
                                global_name: userData.global_name || dm.recipients[0].global_name
                            }
                        }
                    }
                    return dm
                })

                enrichedDMs.sort((a, b) => {
                    const aId = a.last_message_id ? BigInt(a.last_message_id) : BigInt(0)
                    const bId = b.last_message_id ? BigInt(b.last_message_id) : BigInt(0)
                    return bId > aId ? 1 : bId < aId ? -1 : 0
                })

                setDmChannels(enrichedDMs)
                setStats({
                    friendCount,
                    dmCount: enrichedDMs.filter((dm: DMChannel) => dm.type === 1).length,
                    groupDmCount: enrichedDMs.filter((dm: DMChannel) => dm.type === 3).length
                })
            }
        } catch (e) {
            console.error('Failed to load dashboard data:', e)
        } finally {
            setLoading(false)
        }
    }

    const toggleDMSelection = (id: string) => {
        const newSelected = new Set(selectedDMs)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedDMs(newSelected)
    }

    const toggleSelectAll = () => {
        if (selectedDMs.size === filteredDMs.length) {
            setSelectedDMs(new Set())
        } else {
            setSelectedDMs(new Set(filteredDMs.map(dm => dm.id)))
        }
    }

    const cleanSelectedDMs = async () => {
        if (selectedDMs.size === 0) return

        if (selectedDMs.size >= 10) {
            setPendingCleanCount(selectedDMs.size)
            setShowConfirmModal(true)
        } else {
            startCleaning()
        }
    }

    const startCleaning = async () => {
        setShowConfirmModal(false)
        setCleaning(true)
        stopRef.current = false
        setViewMode('logs')
        setLogs([])
        setSummaryStats({ total: 0, text: 0, images: 0, embeds: 0 })
        setCleanedChannels([])

        const channelsToClean = Array.from(selectedDMs).map(id => {
            const channel = dmChannels.find(dm => dm.id === id)
            return {
                id,
                name: channel?.recipients[0]?.global_name || channel?.recipients[0]?.username || 'Unknown',
                avatar: channel?.recipients[0]?.avatar,
                recipientId: channel?.recipients[0]?.id
            }
        })

        setLogs([{
            id: 'init',
            content: `${channelsToClean.length} conversation(s) queued for deletion.`,
            attachments: [],
            embeds: [],
            timestamp: new Date(),
            channelName: 'System',
            type: 'system'
        }])

        setCleaningProgress({ current: 0, total: 0, currentChannel: 'Initializing...' })

        let globalDeletedCount = 0
        let completedChannels = 0
        const channelStats: CleanedChannel[] = []

        for (const channelId of selectedDMs) {
            if (stopRef.current) break

            const channel = dmChannels.find(dm => dm.id === channelId)
            const channelName = channel?.recipients[0]?.global_name || channel?.recipients[0]?.username || 'Unknown'
            const channelAvatar = channel?.recipients[0]?.avatar
            const recipientId = channel?.recipients[0]?.id
            completedChannels++

            setCleaningProgress(prev => ({
                ...prev,
                currentChannel: `[${completedChannels}/${channelsToClean.length}] Cleaning @${channelName}`
            }))

            let lastMessageId: string | null = null
            let hasMore = true
            let channelDeletedCount = 0

            while (hasMore && !stopRef.current) {
                try {
                    let url = `https://discord.com/api/v9/channels/${channelId}/messages?limit=${appSettings.batchSize}`
                    if (lastMessageId) {
                        url += `&before=${lastMessageId}`
                    }

                    const res = await fetch(url, { headers: { Authorization: account.token } })

                    if (!res.ok) {
                        if (res.status === 429) {
                            const data = await res.json()
                            await new Promise(r => setTimeout(r, (data.retry_after || 1) * 1000 + 500))
                            continue
                        }
                        break
                    }

                    const messages: any[] = await res.json()

                    if (!Array.isArray(messages) || messages.length === 0) {
                        hasMore = false
                        break
                    }

                    // Process ALL messages sequentially to avoid skipping
                    for (const message of messages) {
                        if (stopRef.current) break

                        // Only delete messages from current user
                        if (message.author.id !== account.id) {
                            continue
                        }

                        try {
                            const delRes = await fetch(
                                `https://discord.com/api/v9/channels/${channelId}/messages/${message.id}`,
                                {
                                    method: 'DELETE',
                                    headers: { Authorization: account.token }
                                }
                            )

                            if (delRes.status === 429) {
                                const data = await delRes.json()
                                await new Promise(r => setTimeout(r, (data.retry_after || 1) * 1000))
                            } else if (delRes.ok || delRes.status === 404) {
                                globalDeletedCount++
                                channelDeletedCount++
                                setCleaningProgress(prev => ({ ...prev, current: globalDeletedCount }))

                                setSummaryStats(prev => {
                                    const hasAttachments = message.attachments?.length > 0
                                    const hasEmbeds = message.embeds?.length > 0
                                    const isTextOnly = !hasAttachments && !hasEmbeds

                                    return {
                                        total: prev.total + 1,
                                        text: prev.text + (isTextOnly ? 1 : 0),
                                        images: prev.images + (hasAttachments ? 1 : 0),
                                        embeds: prev.embeds + (hasEmbeds ? 1 : 0)
                                    }
                                })

                                const attachmentUrls = message.attachments?.map((a: any) => a.url) || []
                                setLogs(prev => [...prev.slice(-49), {
                                    id: message.id,
                                    content: message.content,
                                    attachments: attachmentUrls,
                                    embeds: message.embeds || [],
                                    timestamp: new Date(),
                                    channelName: channelName
                                }])
                            }

                            await new Promise(r => setTimeout(r, appSettings.deleteDelay))
                        } catch (e) {
                            console.error('[DELETE_ERROR]', e)
                        }
                    }

                    // Update lastMessageId to the LAST message in the batch (not filtered)
                    lastMessageId = messages[messages.length - 1].id

                    if (messages.length < appSettings.batchSize) {
                        hasMore = false
                    }

                } catch (e) {
                    console.error("Batch fetch error", e)
                    hasMore = false
                }
            }

            if (channelDeletedCount > 0) {
                channelStats.push({
                    id: channelId,
                    name: channelName,
                    avatar: channelAvatar ? `https://cdn.discordapp.com/avatars/${recipientId}/${channelAvatar}.png` : undefined,
                    count: channelDeletedCount
                })

                setLogs(prev => [...prev, {
                    id: `complete-${channelId}`,
                    content: `Completed conversation with @${channelName}`,
                    attachments: [],
                    embeds: [],
                    timestamp: new Date(),
                    channelName: 'System',
                    type: 'success'
                }])
            }
        }

        setCleanedChannels(channelStats)
        setSelectedDMs(new Set())
        setCleaning(false)

        setLogs(prev => [...prev, {
            id: 'complete',
            content: 'Operation Completed',
            attachments: [],
            embeds: [],
            timestamp: new Date(),
            channelName: 'System',
            type: 'summary'
        }])

        setShowSummary(true)
    }

    const handleOpenChat = async (dmOrFriend: DMChannel | Friend) => {
        setChatLoading(true)
        
        // Convert DM to Friend format if needed
        let friendData: Friend
        if ('recipients' in dmOrFriend) {
            // It's a DMChannel
            const recipient = dmOrFriend.recipients[0]
            friendData = {
                id: dmOrFriend.id,
                user: {
                    id: recipient.id,
                    username: recipient.username,
                    global_name: recipient.global_name,
                    avatar: recipient.avatar,
                    discriminator: '0'
                },
                type: 1
            }
        } else {
            // It's already a Friend
            friendData = dmOrFriend
        }
        
        setSelectedChatFriend(friendData)
        setChatMessages([])

        try {
            let channel = dmChannels.find(ch => ch.type === 1 && ch.recipients[0]?.id === friendData.user.id)

            if (!channel) {
                const res = await fetch('https://discord.com/api/v9/users/@me/channels', {
                    method: 'POST',
                    headers: {
                        'Authorization': account.token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ recipient_id: friendData.user.id })
                })
                if (res.ok) {
                    channel = await res.json()
                }
            }

            if (channel) {
                const msgRes = await fetch(`https://discord.com/api/v9/channels/${channel.id}/messages?limit=50`, {
                    headers: { Authorization: account.token }
                })

                if (msgRes.ok) {
                    const msgs = await msgRes.json()
                    setChatMessages(Array.isArray(msgs) ? msgs.reverse() : [])
                }
            }
        } catch (error) {
            console.error('Failed to open chat', error)
        } finally {
            setChatLoading(false)
        }
    }

    const filteredDMs = dmChannels.filter(dm => {
        if (!searchQuery) return true
        const recipient = dm.recipients[0]
        return recipient?.username.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const filteredFriends = friendsList.filter(f => {
        if (!friendsSearchQuery) return true
        return f.user.username.toLowerCase().includes(friendsSearchQuery.toLowerCase()) ||
            f.user.global_name?.toLowerCase().includes(friendsSearchQuery.toLowerCase())
    })
    
    // Suppress unused variable warning - used in FriendsModal
    void filteredFriends

    return (
        <div className="flex h-screen text-slate-200 font-sans selection:bg-wf-blue-500/30 selection:text-white overflow-hidden flex-col relative">
            {/* Background Layer */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${appBgImage})` }} />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117]/92 via-[#161b22]/88 to-[#0d1117]/92" />
            
            {/* Content Layer */}
            <div className="relative z-10 flex flex-col h-full">
            <Titlebar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    account={account}
                    stats={stats}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onShowFriends={() => setShowFriendsModal(true)}
                    onBack={onBack}
                />

                {/* Main Content - Messages Tab */}
                {activeTab === 'messages' && (
                    <main className="flex-1 flex flex-col relative bg-[#0d1117]/40 backdrop-blur-sm">
                        {/* Top Bar */}
                        <header className="h-20 px-6 border-b border-wf-blue-500/10 bg-[#0d1117]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-6">
                            <div className="flex-1 max-w-2xl">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-500 group-focus-within:text-wf-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search conversation history..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-2.5 bg-[#161b22]/80 border border-wf-blue-500/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-wf-blue-500/50 focus:border-wf-blue-500 transition-all shadow-sm group-focus-within:shadow-md group-focus-within:bg-[#1c2128]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {viewMode === 'list' && (
                                    <>
                                        <div className="flex items-center gap-3 bg-[#161b22]/80 p-1.5 pr-3 rounded-lg border border-wf-blue-500/10">
                                            <button
                                                onClick={toggleSelectAll}
                                                className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-wf-blue-500/20 transition-all"
                                            >
                                                {selectedDMs.size === filteredDMs.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                            <div className="w-px h-4 bg-wf-blue-500/20" />
                                            <span className="text-xs font-medium text-slate-500">
                                                <span className="text-white font-bold">{selectedDMs.size > 0 ? selectedDMs.size : filteredDMs.length}</span>
                                                {' '}{selectedDMs.size > 0 ? 'Selected' : 'Total'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={cleanSelectedDMs}
                                            disabled={selectedDMs.size === 0 || cleaning}
                                            className={`h-10 px-5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${selectedDMs.size > 0 && !cleaning
                                                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 hover:scale-105 active:scale-95 shadow-rose-900/20'
                                                : 'bg-[#1f1f23] text-slate-600 cursor-not-allowed'
                                                }`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Clean</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </header>

                        {/* Content Body */}
                        <div className="flex-1 flex flex-col overflow-hidden relative">
                            {loading ? (
                                <div className="flex-1 h-full flex flex-col items-center justify-center gap-4 opacity-60">
                                    <div className="p-3 bg-[#161b22]/80 rounded-full">
                                        <Loader2 className="w-8 h-8 text-wf-blue-500 animate-spin" />
                                    </div>
                                    <p className="text-base font-medium text-slate-400">Syncing your conversations...</p>
                                </div>
                            ) : viewMode === 'logs' ? (
                                <LogsView
                                    logs={logs}
                                    account={account}
                                    cleaning={cleaning}
                                    summaryStats={summaryStats}
                                    cleanedChannels={cleanedChannels}
                                    logEndRef={logEndRef}
                                    onStop={() => stopRef.current = true}
                                    onShowSummary={() => setShowSummary(true)}
                                    onShowChannelList={() => setShowChannelListModal(true)}
                                    onDone={() => setViewMode('list')}
                                />
                            ) : (
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                    <DMListView
                                        dms={filteredDMs}
                                        selectedDMs={selectedDMs}
                                        onToggleSelection={toggleDMSelection}
                                        onOpenChat={handleOpenChat}
                                    />
                                </div>
                            )}

                            {/* Cleaning Progress Footer */}
                            {cleaning && (
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                                    <motion.div
                                        initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        className="bg-[#161b22]/90 backdrop-blur-xl border border-wf-blue-500/20 shadow-2xl rounded-full pl-2 pr-6 py-2 flex items-center gap-4 min-w-[320px]"
                                    >
                                        <div className="relative w-10 h-10 flex-shrink-0">
                                            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                                                <path
                                                    className="text-wf-blue-500/20"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                />
                                                <path
                                                    className="text-wf-blue-500 transition-all duration-500 ease-out"
                                                    strokeDasharray={`100, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white font-mono">
                                                {cleaningProgress.current}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="text-xs font-bold text-white truncate leading-tight">
                                                {cleaningProgress.currentChannel}
                                            </h4>
                                            <span className="text-[10px] font-medium text-wf-blue-400 font-mono">
                                                {cleaningProgress.current} MESSAGES DELETED
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </main>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <main className="flex-1 flex flex-col relative bg-[#0d1117]/40 backdrop-blur-sm overflow-hidden">
                        <SettingsView
                            settings={appSettings}
                            account={account}
                            onSettingsChange={setAppSettings}
                            onSignOut={onBack}
                        />
                    </main>
                )}
            </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                show={showConfirmModal}
                count={pendingCleanCount}
                onConfirm={startCleaning}
                onCancel={() => setShowConfirmModal(false)}
            />

            <SummaryModal
                show={showSummary}
                cleaning={cleaning}
                stats={summaryStats}
                cleanedChannels={cleanedChannels}
                onClose={() => setShowSummary(false)}
                onShowChannelList={() => setShowChannelListModal(true)}
            />

            <ChannelListModal
                show={showChannelListModal}
                channels={cleanedChannels}
                stats={summaryStats}
                onClose={() => setShowChannelListModal(false)}
            />

            <FriendsModal
                show={showFriendsModal}
                friends={friendsList}
                searchQuery={friendsSearchQuery}
                onSearchChange={setFriendsSearchQuery}
                onOpenChat={handleOpenChat}
                onClose={() => setShowFriendsModal(false)}
            />

            <ChatModal
                show={selectedChatFriend !== null}
                friend={selectedChatFriend}
                messages={chatMessages}
                loading={chatLoading}
                account={account}
                chatEndRef={chatEndRef}
                onClose={() => setSelectedChatFriend(null)}
            />
        </div>
    )
}

// Type Definitions
export interface DashboardProps {
    account: {
        id: string
        username: string
        globalName?: string
        avatar: string
        token: string
    }
    onBack: () => void
}

export interface DMChannel {
    id: string
    type: number
    recipients: Array<{
        id: string
        username: string
        avatar: string
        global_name?: string
        public_flags?: number
        premium_type?: number
        premium_since?: string
    }>
    last_message_id?: string
}

export interface Friend {
    id: string
    user: {
        id: string
        username: string
        global_name?: string
        avatar: string
        discriminator: string
    }
    type: number
}

export interface Stats {
    friendCount: number
    dmCount: number
    groupDmCount: number
}

export interface LogEntry {
    id: string
    content: string
    attachments: string[]
    embeds: any[]
    timestamp: Date
    channelName?: string
    type?: 'message' | 'system' | 'success' | 'summary'
}

export interface LogSession {
    id: string
    name: string
    status: 'pending' | 'active' | 'completed' | 'error'
    logs: LogEntry[]
}

export interface CleanedChannel {
    id: string
    name: string
    avatar?: string
    count: number
}

export interface AppSettings {
    deleteDelay: number
    batchSize: number
    autoRefresh: boolean
    autoScroll: boolean
    deleteAttachments: boolean
    stopOnError: boolean
}

export interface SummaryStats {
    total: number
    text: number
    images: number
    embeds: number
}

export interface CleaningProgress {
    current: number
    total: number
    currentChannel: string
}

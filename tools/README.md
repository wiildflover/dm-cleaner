# GitHub Deployment Tools

Profesyonel GitHub deployment araçları - Otomatik commit mesajları ve kolay yükleme.

## Araçlar

### 1. github-deploy.js (Node.js)
Akıllı commit mesajları ile otomatik GitHub deployment.

**Özellikler:**
- Dosyaları kategorilere göre gruplar
- Her kategori için ayrı commit oluşturur
- Profesyonel commit mesajları
- Renkli terminal çıktısı
- Hata yönetimi

**Kullanım:**
```bash
cd github-dmcleaner
node tools/github-deploy.js
```

### 2. github-setup.ps1 (PowerShell - Windows)
Windows için otomatik deployment scripti.

**Özellikler:**
- Tek commit ile tüm dosyaları yükler
- Profesyonel banner ve çıktılar
- Renkli PowerShell çıktısı
- Hata kontrolü

**Kullanım:**
```powershell
cd github-dmcleaner
.\tools\github-setup.ps1
```

### 3. github-setup.sh (Bash - Linux/macOS)
Linux ve macOS için otomatik deployment scripti.

**Özellikler:**
- Tek commit ile tüm dosyaları yükler
- Profesyonel banner ve çıktılar
- Renkli terminal çıktısı
- Cross-platform uyumluluk

**Kullanım:**
```bash
cd github-dmcleaner
chmod +x tools/github-setup.sh
./tools/github-setup.sh
```

## Hangi Aracı Kullanmalıyım?

### Node.js Tool (github-deploy.js)
**Kullan eğer:**
- Akıllı, kategorize edilmiş commitler istiyorsanız
- Her dosya türü için ayrı commit geçmişi istiyorsanız
- Daha detaylı commit history istiyorsanız

**Avantajlar:**
- Dosyaları otomatik kategorize eder
- Her kategori için ayrı commit
- Daha temiz git history
- Profesyonel commit mesajları

**Dezavantajlar:**
- Daha fazla commit oluşturur
- Biraz daha yavaş

### PowerShell/Bash Scripts
**Kullan eğer:**
- Hızlı ve basit deployment istiyorsanız
- Tek bir initial commit yeterli ise
- Minimum kurulum istiyorsanız

**Avantajlar:**
- Çok hızlı
- Tek commit
- Basit kullanım
- Ek bağımlılık yok

**Dezavantajlar:**
- Tek commit (tüm dosyalar birlikte)
- Daha az detaylı history

## Adım Adım Kullanım

### Hazırlık

1. **GitHub'da Repository Oluştur**
   - GitHub.com'a git
   - "New repository" tıkla
   - Repository adı: `dm-cleaner`
   - Description ekle
   - Public/Private seç
   - **Initialize seçeneklerini boş bırak**
   - "Create repository" tıkla

2. **Repository URL'ini Kopyala**
   ```
   https://github.com/KULLANICI_ADINIZ/dm-cleaner.git
   ```

### Yöntem 1: Node.js Tool (Önerilen)

```bash
# Proje klasörüne git
cd github-dmcleaner

# Tool'u çalıştır
node tools/github-deploy.js

# Repository URL'ini gir
# Örnek: https://github.com/wildflover/dm-cleaner.git

# GitHub credentials gir (gerekirse)
```

### Yöntem 2: PowerShell (Windows)

```powershell
# Proje klasörüne git
cd github-dmcleaner

# Script'i çalıştır
.\tools\github-setup.ps1

# Repository URL'ini gir
# GitHub credentials gir (gerekirse)
```

### Yöntem 3: Bash (Linux/macOS)

```bash
# Proje klasörüne git
cd github-dmcleaner

# Script'i executable yap
chmod +x tools/github-setup.sh

# Script'i çalıştır
./tools/github-setup.sh

# Repository URL'ini gir
# GitHub credentials gir (gerekirse)
```

## GitHub Authentication

### Personal Access Token (Önerilen)

GitHub artık şifre ile push yapmaya izin vermiyor. Token kullanmanız gerekiyor:

1. **Token Oluştur**
   - GitHub → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - "Generate new token (classic)"
   - Note: `DM Cleaner Development`
   - Expiration: 90 days
   - Scopes: `repo` (tüm repo izinleri)
   - "Generate token"
   - Token'ı kopyala

2. **Token ile Push**
   - Username: GitHub kullanıcı adınız
   - Password: Oluşturduğunuz token

### SSH Key (Alternatif)

```bash
# SSH key oluştur
ssh-keygen -t ed25519 -C "your-email@example.com"

# Public key'i kopyala
cat ~/.ssh/id_ed25519.pub

# GitHub'a ekle
# Settings → SSH and GPG keys → New SSH key

# SSH URL kullan
git remote set-url origin git@github.com:KULLANICI_ADINIZ/dm-cleaner.git
```

## Commit Mesaj Formatı

### Node.js Tool Kategorileri

Tool dosyaları otomatik olarak kategorize eder:

- **docs:** Dokümantasyon dosyaları (.md, LICENSE, .txt)
- **feat:** Kaynak kod dosyaları (.ts, .tsx, .js, .jsx)
- **style:** Stil dosyaları (.css, .scss, tailwind)
- **chore:** Konfigürasyon dosyaları (config, eslint, prettier)
- **assets:** Asset dosyaları (.png, .jpg, .svg, .ico)
- **ci:** GitHub workflows ve CI/CD
- **build:** Bağımlılıklar (package.json)

### Örnek Commit Mesajları

```
docs: add documentation (15 files)
  - README.md
  - CONTRIBUTING.md
  - SECURITY.md
  ... and 12 more files

feat: add source code (144 files)
  - src/main/index.ts
  - src/renderer/src/App.tsx
  - src/renderer/src/Dashboard.tsx
  ... and 141 more files

assets: add assets (120 files)
  - badges/activedeveloper.svg
  - badges/discordnitro.svg
  ... and 118 more files
```

## Sorun Giderme

### Git Bulunamadı

**Hata:** `Git is not installed or not in PATH`

**Çözüm:**
```bash
# Windows
winget install Git.Git

# macOS
brew install git

# Linux
sudo apt install git  # Ubuntu/Debian
```

### Remote Already Exists

**Hata:** `Remote origin already exists`

**Çözüm:**
```bash
# Remote'u güncelle
git remote set-url origin https://github.com/KULLANICI_ADINIZ/dm-cleaner.git

# Veya sil ve yeniden ekle
git remote remove origin
git remote add origin https://github.com/KULLANICI_ADINIZ/dm-cleaner.git
```

### Authentication Failed

**Hata:** `Authentication failed`

**Çözüm:**
- Personal Access Token kullan (şifre değil)
- Token'ın `repo` yetkisi olduğundan emin ol
- Token'ın süresi dolmamış olmalı

### Push Rejected

**Hata:** `Updates were rejected`

**Çözüm:**
```bash
# Remote'daki değişiklikleri çek
git pull origin main --rebase

# Tekrar push et
git push origin main
```

## Manuel Deployment

Eğer toolları kullanmak istemezseniz, manuel olarak da yapabilirsiniz:

```bash
# Git başlat
git init

# Dosyaları ekle
git add .

# Commit oluştur
git commit -m "Initial commit: Wildflover DM Cleaner v1.0.0"

# Branch ayarla
git branch -M main

# Remote ekle
git remote add origin https://github.com/KULLANICI_ADINIZ/dm-cleaner.git

# Push yap
git push -u origin main
```

## Sonraki Adımlar

Deployment tamamlandıktan sonra:

1. **Repository'yi Kontrol Et**
   - GitHub'da repository'nizi ziyaret edin
   - Tüm dosyaların yüklendiğini doğrulayın
   - README.md'nin düzgün görüntülendiğini kontrol edin

2. **Repository Ayarları**
   - About bölümünü düzenleyin
   - Topics ekleyin
   - Description güncelleyin
   - Website URL'i ekleyin (varsa)

3. **İlk Release**
   - Releases → Create a new release
   - Tag: `v1.0.0`
   - Title: `v1.0.0 - Initial Release`
   - Description: CHANGELOG.md'den kopyalayın
   - Publish release

4. **README Badge'leri**
   - Version badge
   - License badge
   - Download badge
   - Stars badge

## Destek

Sorun yaşarsanız:
- [GitHub Issues](https://github.com/wildflover/dm-cleaner/issues)
- [GITHUB_SETUP.md](../GITHUB_SETUP.md) dosyasına bakın
- Git dokümantasyonunu inceleyin

---

**Başarılar!** Projeniz artık GitHub'da profesyonel bir şekilde yayınlanmaya hazır.

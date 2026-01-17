# GitHub Deployment Rehberi

Bu rehber, projenizi GitHub'a yüklemek için gereken tüm adımları içerir.

## Hızlı Başlangıç

### Otomatik Deployment (Önerilen)

Projenizi tek komutla GitHub'a yükleyin:

**Windows (PowerShell):**
```powershell
npm run deploy:win
```

**Linux/macOS (Bash):**
```bash
npm run deploy:unix
```

**Node.js (Tüm Platformlar):**
```bash
npm run deploy
```

## Detaylı Adımlar

### 1. GitHub Repository Oluşturma

1. [GitHub.com](https://github.com)'a gidin ve giriş yapın
2. Sağ üst köşedeki "+" ikonuna tıklayın
3. "New repository" seçin
4. Repository bilgilerini girin:
   - **Name:** `dm-cleaner`
   - **Description:** `Professional Discord message management tool`
   - **Visibility:** Public veya Private
   - **Initialize:** Hiçbir şey seçmeyin (boş bırakın)
5. "Create repository" butonuna tıklayın
6. Repository URL'ini kopyalayın:
   ```
   https://github.com/KULLANICI_ADINIZ/dm-cleaner.git
   ```

### 2. Deployment Tool Seçimi

#### Seçenek A: Node.js Tool (Akıllı Commitler)

**Özellikler:**
- Dosyaları kategorilere göre ayırır
- Her kategori için ayrı commit oluşturur
- Profesyonel commit mesajları
- Detaylı git history

**Kullanım:**
```bash
npm run deploy
```

Tool çalıştığında:
1. Git kurulumunu kontrol eder
2. Repository'yi başlatır
3. Dosyaları kategorize eder
4. Her kategori için commit oluşturur
5. Repository URL'ini sorar
6. GitHub'a push yapar

#### Seçenek B: PowerShell Script (Windows)

**Özellikler:**
- Hızlı ve basit
- Tek commit
- Renkli çıktı
- Windows optimize

**Kullanım:**
```powershell
npm run deploy:win
```

#### Seçenek C: Bash Script (Linux/macOS)

**Özellikler:**
- Hızlı ve basit
- Tek commit
- Renkli çıktı
- Unix optimize

**Kullanım:**
```bash
npm run deploy:unix
```

### 3. GitHub Authentication

#### Personal Access Token (Önerilen)

GitHub artık şifre ile push yapmaya izin vermiyor. Token oluşturmanız gerekiyor:

**Token Oluşturma:**

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. "Generate new token (classic)" tıklayın
4. Token ayarları:
   - **Note:** `DM Cleaner Development`
   - **Expiration:** 90 days (veya istediğiniz süre)
   - **Scopes:** ✅ `repo` (tüm repo izinleri)
5. "Generate token" butonuna tıklayın
6. Token'ı kopyalayın (bir daha gösterilmeyecek!)

**Token Kullanımı:**

Push yaparken:
- **Username:** GitHub kullanıcı adınız
- **Password:** Oluşturduğunuz token (şifre değil!)

#### SSH Key (Alternatif)

**SSH Key Oluşturma:**

```bash
# SSH key oluştur
ssh-keygen -t ed25519 -C "your-email@example.com"

# Public key'i göster
cat ~/.ssh/id_ed25519.pub
```

**GitHub'a Ekleme:**

1. GitHub → Settings → SSH and GPG keys
2. "New SSH key" tıklayın
3. Title: `My Computer`
4. Key: Public key'i yapıştırın
5. "Add SSH key" tıklayın

**SSH URL Kullanımı:**

```bash
git remote set-url origin git@github.com:KULLANICI_ADINIZ/dm-cleaner.git
```

### 4. Manuel Deployment

Eğer toolları kullanmak istemezseniz:

```bash
# 1. Git başlat
git init

# 2. Dosyaları ekle
git add .

# 3. Commit oluştur
git commit -m "Initial commit: Wildflover DM Cleaner v1.0.0"

# 4. Branch ayarla
git branch -M main

# 5. Remote ekle
git remote add origin https://github.com/KULLANICI_ADINIZ/dm-cleaner.git

# 6. Push yap
git push -u origin main
```

## Commit Mesaj Formatları

### Node.js Tool Kategorileri

Tool dosyaları otomatik olarak kategorize eder:

| Kategori | Prefix | Dosya Türleri |
|----------|--------|---------------|
| Documentation | `docs:` | .md, LICENSE, .txt |
| Source Code | `feat:` | .ts, .tsx, .js, .jsx |
| Styling | `style:` | .css, .scss, tailwind |
| Configuration | `chore:` | config files, eslint, prettier |
| Assets | `assets:` | .png, .jpg, .svg, .ico |
| CI/CD | `ci:` | .github/, workflows/ |
| Dependencies | `build:` | package.json, package-lock.json |

### Örnek Commit Mesajları

```
docs: add documentation (15 files)
  - README.md
  - CONTRIBUTING.md
  - SECURITY.md
  - CHANGELOG.md
  ... and 11 more files

feat: add source code (144 files)
  - src/main/index.ts
  - src/renderer/src/App.tsx
  - src/renderer/src/Dashboard.tsx
  ... and 141 more files

assets: add assets (120 files)
  - badges/activedeveloper.svg
  - badges/discordnitro.svg
  - icon.png
  ... and 117 more files

chore: add configuration (12 files)
  - tsconfig.json
  - .eslintrc.cjs
  - .prettierrc.json
  ... and 9 more files

ci: add CI/CD configuration (3 files)
  - .github/workflows/test.yml
  - .github/workflows/build.yml
  - .github/PULL_REQUEST_TEMPLATE.md
```

## Deployment Sonrası

### 1. Repository Ayarları

**About Bölümü:**
1. Repository sayfasında sağ üstteki ⚙️ ikonuna tıklayın
2. Bilgileri girin:
   - **Description:** `Professional Discord message management tool built with Electron, React, and TypeScript`
   - **Website:** Varsa proje web siteniz
   - **Topics:** `electron`, `discord`, `react`, `typescript`, `dm-cleaner`, `message-management`, `desktop-app`

**Social Preview:**
1. Settings → General → Social preview
2. Upload image (1280x640px önerilen)

### 2. İlk Release Oluşturma

1. Repository → Releases → "Create a new release"
2. Release bilgileri:
   - **Tag:** `v1.0.0` (yeni tag oluştur)
   - **Title:** `v1.0.0 - Initial Release`
   - **Description:** CHANGELOG.md'den kopyalayın
3. "Publish release" tıklayın

### 3. README Badge'leri Ekleme

README.md'ye ekleyebileceğiniz badge'ler:

```markdown
![Version](https://img.shields.io/github/v/release/KULLANICI_ADINIZ/dm-cleaner?style=for-the-badge)
![Downloads](https://img.shields.io/github/downloads/KULLANICI_ADINIZ/dm-cleaner/total?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/KULLANICI_ADINIZ/dm-cleaner?style=for-the-badge)
![License](https://img.shields.io/github/license/KULLANICI_ADINIZ/dm-cleaner?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/KULLANICI_ADINIZ/dm-cleaner?style=for-the-badge)
```

### 4. Branch Protection (Önerilen)

1. Settings → Branches → "Add branch protection rule"
2. Branch name pattern: `main`
3. Ayarlar:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging
4. "Create" tıklayın

## Sorun Giderme

### Git Bulunamadı

**Hata:** `Git is not installed or not in PATH`

**Çözüm:**
```bash
# Windows
winget install Git.Git

# macOS
brew install git

# Linux (Ubuntu/Debian)
sudo apt install git

# Linux (Fedora)
sudo dnf install git

# Linux (Arch)
sudo pacman -S git
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

**Hata:** `Authentication failed for 'https://github.com/...'`

**Çözüm:**
1. Personal Access Token kullanın (şifre değil)
2. Token'ın `repo` yetkisi olduğundan emin olun
3. Token'ın süresi dolmamış olmalı
4. Username ve token'ı doğru girdiğinizden emin olun

### Push Rejected

**Hata:** `Updates were rejected because the remote contains work that you do not have locally`

**Çözüm:**
```bash
# Remote'daki değişiklikleri çek
git pull origin main --rebase

# Tekrar push et
git push origin main
```

### Permission Denied (SSH)

**Hata:** `Permission denied (publickey)`

**Çözüm:**
```bash
# SSH agent'ı başlat
eval "$(ssh-agent -s)"

# SSH key'i ekle
ssh-add ~/.ssh/id_ed25519

# Bağlantıyı test et
ssh -T git@github.com
```

## Güncellemeler

### Yeni Değişiklikler Push Etme

```bash
# Değişiklikleri ekle
git add .

# Commit oluştur
git commit -m "feat: yeni özellik eklendi"

# Push yap
git push origin main
```

### Yeni Release Oluşturma

```bash
# Tag oluştur
git tag -a v1.1.0 -m "Version 1.1.0"

# Tag'i push et
git push origin v1.1.0
```

GitHub Actions otomatik olarak build alıp release oluşturacak.

## Yardım ve Destek

### Dokümantasyon

- [tools/README.md](tools/README.md) - Tool detayları
- [GITHUB_SETUP.md](GITHUB_SETUP.md) - Detaylı GitHub kurulum
- [CONTRIBUTING.md](CONTRIBUTING.md) - Katkı rehberi

### Kaynaklar

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Actions](https://docs.github.com/en/actions)

### Sorun Bildirme

Sorun yaşarsanız:
1. [GitHub Issues](https://github.com/wildflover/dm-cleaner/issues) kontrol edin
2. Benzer bir sorun yoksa yeni issue açın
3. Hata mesajını ve adımları detaylı yazın

---

**Başarılar!** Projeniz artık GitHub'da profesyonel bir şekilde yayınlanmaya hazır.

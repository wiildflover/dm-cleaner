# GitHub Repository Setup Guide

Bu dosya, projeyi GitHub'a yüklemek için gereken adımları içerir.

## Ön Hazırlık

### 1. GitHub Hesabı

- GitHub hesabınız yoksa [github.com](https://github.com) adresinden oluşturun
- Hesabınıza giriş yapın

### 2. Git Kurulumu

**Windows:**
```powershell
winget install Git.Git
```

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt install git  # Ubuntu/Debian
sudo dnf install git  # Fedora
```

### 3. Git Konfigürasyonu

```bash
git config --global user.name "Wildflover"
git config --global user.email "your-email@example.com"
```

## Repository Oluşturma

### GitHub'da Yeni Repository

1. GitHub'da sağ üst köşedeki "+" ikonuna tıklayın
2. "New repository" seçin
3. Repository bilgilerini girin:
   - **Repository name:** `dm-cleaner`
   - **Description:** `Professional Discord message management tool`
   - **Visibility:** Public veya Private
   - **Initialize:** Hiçbir şey seçmeyin (boş bırakın)
4. "Create repository" butonuna tıklayın

## Projeyi GitHub'a Yükleme

### Adım 1: Terminal'i Açın

Proje klasörüne gidin:
```bash
cd github-dmcleaner
```

### Adım 2: Git Repository Başlatın

```bash
git init
```

### Adım 3: Dosyaları Ekleyin

```bash
git add .
```

### Adım 4: İlk Commit

```bash
git commit -m "Initial commit: Wildflover DM Cleaner v1.0.0"
```

### Adım 5: Ana Branch Adını Ayarlayın

```bash
git branch -M main
```

### Adım 6: Remote Repository Ekleyin

```bash
git remote add origin https://github.com/KULLANICI_ADINIZ/dm-cleaner.git
```

**Not:** `KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı yazın.

### Adım 7: Push Yapın

```bash
git push -u origin main
```

İlk push için GitHub kullanıcı adı ve şifreniz (veya personal access token) istenecektir.

## GitHub Personal Access Token

GitHub artık şifre ile push yapmaya izin vermiyor. Token oluşturmanız gerekiyor:

### Token Oluşturma

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Token bilgileri:
   - **Note:** `DM Cleaner Development`
   - **Expiration:** 90 days (veya istediğiniz süre)
   - **Scopes:** `repo` (tüm repo izinleri)
4. "Generate token" butonuna tıklayın
5. Token'ı kopyalayın (bir daha gösterilmeyecek!)

### Token ile Push

```bash
git push -u origin main
```

- **Username:** GitHub kullanıcı adınız
- **Password:** Oluşturduğunuz token

## Repository Ayarları

### 1. About Bölümü

Repository sayfasında sağ üstteki ⚙️ (Settings) ikonuna tıklayın:

- **Description:** `Professional Discord message management tool built with Electron, React, and TypeScript`
- **Website:** Varsa proje web siteniz
- **Topics:** `electron`, `discord`, `react`, `typescript`, `dm-cleaner`, `message-management`

### 2. README Önizleme

Repository ana sayfasında README.md otomatik olarak görüntülenecektir.

### 3. GitHub Pages (Opsiyonel)

Dokümantasyon için GitHub Pages aktif edebilirsiniz:

1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main → /docs
4. Save

### 4. Branch Protection (Önerilen)

1. Settings → Branches
2. "Add branch protection rule"
3. Branch name pattern: `main`
4. Ayarlar:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging

### 5. GitHub Actions

Workflow dosyaları zaten `.github/workflows/` klasöründe mevcut:
- `test.yml` - Otomatik testler
- `build.yml` - Build ve release

İlk push'tan sonra Actions sekmesinde otomatik çalışacaklar.

## Release Oluşturma

### İlk Release

1. Repository sayfasında "Releases" → "Create a new release"
2. "Choose a tag" → `v1.0.0` yazın → "Create new tag"
3. Release bilgileri:
   - **Release title:** `v1.0.0 - Initial Release`
   - **Description:** CHANGELOG.md'den kopyalayın
4. "Publish release" butonuna tıklayın

### Otomatik Build

GitHub Actions, tag push edildiğinde otomatik olarak:
- Tüm platformlar için build alır
- Release'e dosyaları ekler
- Checksums oluşturur

## Sonraki Adımlar

### 1. Repository Görünürlüğü

**Public Repository için:**
- README.md'de badge'ler ekleyin
- Social preview image ayarlayın
- Topics ekleyin

**Private Repository için:**
- Collaborator ekleyin (Settings → Collaborators)
- Access control ayarlayın

### 2. Dokümantasyon

Tüm dokümantasyon dosyaları hazır:
- ✅ README.md
- ✅ CONTRIBUTING.md
- ✅ SECURITY.md
- ✅ CHANGELOG.md
- ✅ INSTALLATION.md
- ✅ LICENSE
- ✅ docs/API.md
- ✅ docs/ARCHITECTURE.md
- ✅ docs/FAQ.md

### 3. Community Files

GitHub otomatik olarak algılayacak:
- ✅ Code of Conduct
- ✅ Contributing Guidelines
- ✅ License
- ✅ Security Policy
- ✅ Issue Templates
- ✅ Pull Request Template

### 4. Badges Ekleyin

README.md'ye ekleyebileceğiniz badge'ler:

```markdown
![Version](https://img.shields.io/github/v/release/KULLANICI_ADINIZ/dm-cleaner)
![Downloads](https://img.shields.io/github/downloads/KULLANICI_ADINIZ/dm-cleaner/total)
![Stars](https://img.shields.io/github/stars/KULLANICI_ADINIZ/dm-cleaner)
![License](https://img.shields.io/github/license/KULLANICI_ADINIZ/dm-cleaner)
![Issues](https://img.shields.io/github/issues/KULLANICI_ADINIZ/dm-cleaner)
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

### Yeni Release

```bash
# Tag oluştur
git tag -a v1.1.0 -m "Version 1.1.0"

# Tag'i push et
git push origin v1.1.0
```

GitHub Actions otomatik olarak build alıp release oluşturacak.

## Sorun Giderme

### Push Hatası: Authentication Failed

- Personal access token kullanın
- Token'ın `repo` yetkisi olduğundan emin olun
- Token'ın süresi dolmamış olmalı

### Push Hatası: Remote Already Exists

```bash
git remote remove origin
git remote add origin https://github.com/KULLANICI_ADINIZ/dm-cleaner.git
```

### Push Hatası: Updates Were Rejected

```bash
git pull origin main --rebase
git push origin main
```

### Large Files Warning

100MB'dan büyük dosyalar için Git LFS kullanın:

```bash
git lfs install
git lfs track "*.zip"
git add .gitattributes
git commit -m "Add Git LFS"
```

## Yardım

Daha fazla bilgi için:
- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Başarılar!** Projeniz artık GitHub'da profesyonel bir şekilde yayınlanmaya hazır.

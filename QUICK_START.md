# Quick Start - GitHub Deployment

Projenizi 3 adımda GitHub'a yükleyin!

## Adım 1: GitHub Repository Oluştur

1. [GitHub.com](https://github.com)'a git
2. "New repository" tıkla
3. Repository adı: `dm-cleaner`
4. "Create repository" tıkla
5. URL'i kopyala: `https://github.com/KULLANICI_ADINIZ/dm-cleaner.git`

## Adım 2: Deployment Tool Çalıştır

Terminalden proje klasörüne git ve aşağıdaki komutlardan birini çalıştır:

### Windows (PowerShell)
```powershell
cd github-dmcleaner
npm run deploy:win
```

### Linux/macOS (Bash)
```bash
cd github-dmcleaner
npm run deploy:unix
```

### Tüm Platformlar (Node.js)
```bash
cd github-dmcleaner
npm run deploy
```

## Adım 3: Repository URL Gir

Tool çalıştığında:
1. Repository URL'ini yapıştır
2. GitHub kullanıcı adını gir
3. Personal Access Token'ı gir (şifre değil!)

**Token Oluşturma:**
- GitHub → Settings → Developer settings → Personal access tokens
- "Generate new token (classic)"
- Scopes: ✅ `repo`
- Token'ı kopyala

## Tamamlandı!

Projeniz GitHub'da! 

**Sonraki Adımlar:**
- Repository'yi ziyaret et
- About bölümünü düzenle
- İlk release'i oluştur

**Detaylı Bilgi:**
- [DEPLOY.md](DEPLOY.md) - Tam deployment rehberi
- [tools/README.md](tools/README.md) - Tool dokümantasyonu
- [GITHUB_SETUP.md](GITHUB_SETUP.md) - GitHub kurulum detayları

---

**Sorun mu yaşıyorsun?** [DEPLOY.md](DEPLOY.md) dosyasındaki "Sorun Giderme" bölümüne bak.

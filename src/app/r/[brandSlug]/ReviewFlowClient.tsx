'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiCamera, FiChevronRight } from 'react-icons/fi'
import {
  FlowWrapper,
  FlowInner,
  BrandHeader,
  BrandLogo,
  BrandLogoFallback,
  BrandTitle,
  ProgressBarWrapper,
  ProgressText,
  ProgressTrack,
  ProgressFill,
  StepContent,
  StepHeading,
  StepSubtext,
  BranchList,
  BranchButton,
  PrimaryButton,
  GhostButton,
  InstructionList,
  InstructionItem,
  InstructionNumber,
  InstructionContent,
  InstructionTitle,
  InstructionDesc,
  UploadZone,
  UploadIcon,
  UploadLabel,
  UploadHint,
  UploadPreview,
  RetryLink,
  LoadingOverlay,
  Spinner,
  LoadingText,
  ErrorBox,
  ResultWrapper,
  ConfettiPiece,
  ResultCheckCircle,
  ResultGreeting,
  ResultTitle,
  RewardCard,
  RewardCardImage,
  RewardCardImagePlaceholder,
  RewardCardBody,
  RewardCardLabel,
  RewardCardName,
  RewardCardSub,
  CashierBadge,
  ButtonGroup,
} from './ReviewFlowClient.styles'

interface BranchDto {
  id: string
  name: string
  reviewUrl: string
  verificationType: 'MAPS' | 'INSTAGRAM'
  instagramLocationTag: string | null
}

interface RewardDto {
  id: string
  name: string
  imageUrl: string | null
  branchId: string
}

interface BrandDto {
  name: string
  logoUrl: string | null
}

type Step = 'select' | 'review' | 'upload' | 'name' | 'result'

/* Konfeti renkleri */
const CONFETTI_COLORS = ['#F59E0B', '#ffffff', '#34D399', '#FBBF24', '#A7F3D0', '#FDE68A']
const CONFETTI_PIECES = Array.from({ length: 12 }, (_, i) => ({
  delay: (i % 5) * 0.4,
  left: Math.round((i / 12) * 100 + Math.random() * 8),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}))

export default function ReviewFlowClient({
  brand,
  branches,
  rewards,
}: {
  brand: BrandDto
  branches: BranchDto[]
  rewards: RewardDto[]
}) {
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('select')
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [resultReward, setResultReward] = useState<RewardDto | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [customerFirstName, setCustomerFirstName] = useState('')
  const [customerLastName, setCustomerLastName] = useState('')
  const [pendingSubmissionId, setPendingSubmissionId] = useState<string | null>(null)
  const [submittingName, setSubmittingName] = useState(false)

  /* URL'den gelen branch parametresini oku */
  useEffect(() => {
    const branchParam = searchParams.get('branch')
    if (branchParam && branches.some((b) => b.id === branchParam)) {
      setSelectedBranchId(branchParam)
    }
  }, [searchParams, branches])

  const selectedBranch = useMemo(
    () => branches.find((b) => b.id === selectedBranchId) ?? null,
    [branches, selectedBranchId]
  )

  /* Yorum sayfasını yeni sekmede aç — step değişmez */
  const openReview = () => {
    if (!selectedBranch) return
    window.open(selectedBranch.reviewUrl, '_blank', 'noopener,noreferrer')
  }

  /* Upload adımına geç */
  const goToUpload = () => setStep('upload')

  /* Doğrulama isteği gönder */
  const submitForVerification = async (uploadedUrl: string) => {
    if (!selectedBranchId) return
    setClaiming(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: selectedBranchId,
          screenshotPath: uploadedUrl,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Başvuru sırasında bir hata oluştu.')
        return
      }

      if (data.status === 'APPROVED') {
        if (data.reward) {
          setResultReward({
            id: data.reward.id,
            name: data.reward.name,
            imageUrl: data.reward.imageUrl,
            branchId: selectedBranchId,
          })
        } else {
          setResultReward(null)
        }
        setPendingSubmissionId(data.submissionId)
        setStep('name')
      } else {
        setErrorMsg(data.reason || 'Yorum doğrulanamadı. Lütfen tekrar deneyin.')
      }
    } catch {
      setErrorMsg('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setClaiming(false)
    }
  }

  /* Ad soyad gönder ve sonuç ekranına geç */
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pendingSubmissionId) return
    setSubmittingName(true)
    try {
      const fullName = `${customerFirstName.trim()} ${customerLastName.trim()}`.trim()
      await fetch(`/api/submissions/${pendingSubmissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: fullName }),
      })
    } catch {
      // İsim kaydedilemese bile devam et
    } finally {
      setSubmittingName(false)
      setStep('result')
    }
  }

  /* Ekran görüntüsünü yükle ve doğrulama başlat */
  const uploadScreenshot = async (file: File) => {
    setUploading(true)
    setErrorMsg(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Yükleme hatası')
      }
      setScreenshotUrl(data.url)
      await submitForVerification(data.url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Yükleme hatası'
      setErrorMsg(message)
    } finally {
      setUploading(false)
    }
  }

  /* Dosya seçici tetikle */
  const triggerFileInput = () => {
    if (uploading || claiming) return
    fileInputRef.current?.click()
  }

  /* Dosya değişikliğini yakala */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadScreenshot(file)
  }

  /* Tekrar yükle */
  const retryUpload = () => {
    setScreenshotUrl(null)
    setErrorMsg(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    triggerFileInput()
  }

  /* İlerleme yüzdesi hesapla */
  const progressStep = step === 'select' ? 1 : step === 'review' ? 2 : step === 'upload' ? 3 : step === 'name' ? 4 : 4
  const totalSteps = 4
  const progressPercent = Math.round((progressStep / totalSteps) * 100)

  /* ── Sonuç Ekranı ── */
  if (step === 'result') {
    const customerFullName = [customerFirstName, customerLastName].filter(Boolean).join(' ')

    return (
      <ResultWrapper>
        {CONFETTI_PIECES.map((piece, i) => (
          <ConfettiPiece key={i} $delay={piece.delay} $left={piece.left} $color={piece.color} />
        ))}

        <ResultCheckCircle>🎉</ResultCheckCircle>

        {customerFullName ? (
          <ResultGreeting>Tebrikler, {customerFullName}!</ResultGreeting>
        ) : (
          <ResultGreeting>Tebrikler!</ResultGreeting>
        )}

        <ResultTitle>
          {resultReward ? 'Ödülünüz hazır!' : 'Yorumunuz doğrulandı!'}
        </ResultTitle>

        <RewardCard>
          {resultReward?.imageUrl ? (
            <RewardCardImage src={resultReward.imageUrl} alt={resultReward.name} />
          ) : (
            <RewardCardImagePlaceholder>🎁</RewardCardImagePlaceholder>
          )}
          <RewardCardBody>
            <RewardCardLabel>Kazandığınız Ödül</RewardCardLabel>
            <RewardCardName>
              {resultReward ? resultReward.name : 'Sıradaki kampanya ödülü'}
            </RewardCardName>
            <RewardCardSub>Aşağıdaki mesajı kasaya gösterin</RewardCardSub>
          </RewardCardBody>
        </RewardCard>

        <CashierBadge>
          🧾 Lütfen bu ekranı kasaya gösteriniz
        </CashierBadge>
      </ResultWrapper>
    )
  }

  /* ── Normal Akış ── */
  return (
    <FlowWrapper>
      <FlowInner>
        {/* Marka Başlığı */}
        <BrandHeader>
          {brand.logoUrl ? (
            <BrandLogo src={brand.logoUrl} alt={brand.name} />
          ) : (
            <BrandLogoFallback>
              {brand.name.charAt(0)}
            </BrandLogoFallback>
          )}
          <BrandTitle>{brand.name}</BrandTitle>
        </BrandHeader>

        {/* İlerleme Çubuğu */}
        <ProgressBarWrapper>
          <ProgressText>{progressStep} / {totalSteps}</ProgressText>
          <ProgressTrack>
            <ProgressFill $percent={progressPercent} />
          </ProgressTrack>
        </ProgressBarWrapper>

        {/* ── ADIM 1: Şube Seçimi ── */}
        {step === 'select' && (
          <StepContent>
            <StepHeading>Hangi şubedeysiniz?</StepHeading>
            <StepSubtext>Bulunduğunuz şubeyi seçin</StepSubtext>

            <BranchList>
              {branches.map((branch) => (
                <BranchButton
                  key={branch.id}
                  type="button"
                  $selected={selectedBranchId === branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                >
                  {branch.name}
                </BranchButton>
              ))}
            </BranchList>

            <PrimaryButton
              type="button"
              onClick={() => setStep('review')}
              $disabled={!selectedBranchId}
              disabled={!selectedBranchId}
            >
              Devam Et
              <FiChevronRight size={18} />
            </PrimaryButton>
          </StepContent>
        )}

        {/* ── ADIM 2: Yorum / Hikaye Talimatları ── */}
        {step === 'review' && selectedBranch && (
          <StepContent>
            {selectedBranch.verificationType === 'INSTAGRAM' ? (
              <>
                <StepHeading>Instagram hikayesi paylaşın</StepHeading>
                <StepSubtext>Konum etiketli bir hikaye paylaşıp ekran görüntüsünü yükleyin</StepSubtext>

                <InstructionList>
                  <InstructionItem>
                    <InstructionNumber>1</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>Instagram uygulamasını açın</InstructionTitle>
                      <InstructionDesc>Telefonunuzdan Instagram&apos;a girin</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>

                  <InstructionItem>
                    <InstructionNumber>2</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>Yeni bir hikaye oluşturun</InstructionTitle>
                      <InstructionDesc>Fotoğraf veya video çekin</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>

                  <InstructionItem>
                    <InstructionNumber>3</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>Konum etiketi ekleyin</InstructionTitle>
                      <InstructionDesc>&quot;{selectedBranch.instagramLocationTag}&quot; konumunu seçin</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>

                  <InstructionItem>
                    <InstructionNumber>4</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>Hikayenizi paylaşın</InstructionTitle>
                      <InstructionDesc>Paylaş butonuna basın</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>

                  <InstructionItem>
                    <InstructionNumber>5</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>Ekran görüntüsü alın</InstructionTitle>
                      <InstructionDesc>Paylaşılan hikayeniz açıkken ekranı kaydedin</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>
                </InstructionList>

                <ButtonGroup>
                  <PrimaryButton type="button" onClick={goToUpload}>
                    Hikayeyi Paylaştım, Devam Et
                    <FiChevronRight size={18} />
                  </PrimaryButton>
                </ButtonGroup>
              </>
            ) : (
              <>
                <StepHeading>Adım adım yorum bırakın</StepHeading>
                <StepSubtext>Google yorumunuzu bırakıp ekran görüntüsünü yükleyin</StepSubtext>

                <InstructionList>
                  <InstructionItem>
                    <InstructionNumber>1</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>Google Haritalar açılacak</InstructionTitle>
                      <InstructionDesc>Aşağıdaki butona basın</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>

                  <InstructionItem>
                    <InstructionNumber>2</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>5 yıldız seçin</InstructionTitle>
                      <InstructionDesc>Yorum formunu açmak için yıldızlara tıklayın</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>

                  <InstructionItem>
                    <InstructionNumber>3</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>Yorumunuzu yazın</InstructionTitle>
                      <InstructionDesc>Deneyiminizi birkaç cümleyle anlatın</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>

                  <InstructionItem>
                    <InstructionNumber>4</InstructionNumber>
                    <InstructionContent>
                      <InstructionTitle>Ekran görüntüsü alın</InstructionTitle>
                      <InstructionDesc>Yorum gönderdikten sonra ekranı kaydedin</InstructionDesc>
                    </InstructionContent>
                  </InstructionItem>
                </InstructionList>

                <ButtonGroup>
                  <PrimaryButton type="button" onClick={openReview}>
                    Yoruma Git
                    <FiChevronRight size={18} />
                  </PrimaryButton>
                  <GhostButton type="button" onClick={goToUpload}>
                    Yorumu Yazdım, Devam Et
                  </GhostButton>
                </ButtonGroup>
              </>
            )}
          </StepContent>
        )}

        {/* ── ADIM 3: Ekran Görüntüsü Yükleme ── */}
        {step === 'upload' && (
          <StepContent>
            <StepHeading>Ekran görüntüsünü yükleyin</StepHeading>
            <StepSubtext>Yorumunuzun eklendiğini gösteren ekranı yükleyin</StepSubtext>

            {/* Gizli dosya seçici */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Yükleniyor / Doğrulanıyor durumu */}
            {(uploading || claiming) ? (
              <UploadZone $uploading>
                <LoadingOverlay>
                  <Spinner />
                  <LoadingText>
                    {claiming ? 'Doğrulanıyor...' : 'Yükleniyor...'}
                  </LoadingText>
                </LoadingOverlay>
              </UploadZone>
            ) : screenshotUrl && !errorMsg ? (
              /* Yüklenen görselin önizlemesi */
              <UploadZone $hasFile onClick={retryUpload}>
                <UploadPreview src={screenshotUrl} alt="Yüklenen ekran görüntüsü" />
                <RetryLink type="button" onClick={retryUpload}>
                  Tekrar Yükle
                </RetryLink>
              </UploadZone>
            ) : (
              /* Boş yükleme alanı */
              <UploadZone onClick={triggerFileInput}>
                <UploadIcon>
                  <FiCamera size={40} />
                </UploadIcon>
                <UploadLabel>Fotoğraf Seç</UploadLabel>
                <UploadHint>veya galeriden yükleyin</UploadHint>
              </UploadZone>
            )}

            {/* Hata mesajı */}
            {errorMsg && (
              <>
                <ErrorBox>{errorMsg}</ErrorBox>
                <PrimaryButton type="button" onClick={retryUpload}>
                  Tekrar Dene
                </PrimaryButton>
              </>
            )}
          </StepContent>
        )}

        {/* ── ADIM 4: Ad Soyad Girişi (doğrulama sonrası) ── */}
        {step === 'name' && (
          <StepContent>
            <StepHeading>Son bir adım!</StepHeading>
            <StepSubtext>Ödülü almak için adınızı ve soyadınızı girin.</StepSubtext>

            <form
              onSubmit={handleNameSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}
            >
              <input
                type="text"
                placeholder="Adınız"
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 12,
                  border: '2px solid #e2e8f0', fontSize: '1rem',
                  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
              <input
                type="text"
                placeholder="Soyadınız"
                value={customerLastName}
                onChange={(e) => setCustomerLastName(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 12,
                  border: '2px solid #e2e8f0', fontSize: '1rem',
                  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
              <PrimaryButton
                type="submit"
                disabled={!customerFirstName.trim() || !customerLastName.trim() || submittingName}
                style={{ marginTop: 8, opacity: (!customerFirstName.trim() || !customerLastName.trim()) ? 0.5 : 1 }}
              >
                {submittingName ? 'Kaydediliyor...' : 'Ödülü Al →'}
              </PrimaryButton>
            </form>
          </StepContent>
        )}
      </FlowInner>
    </FlowWrapper>
  )
}

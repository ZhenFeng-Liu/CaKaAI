import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
const AIimagesPage: FC = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const comfyUIUrl = 'http://192.168.0.123:8188/'

  useEffect(() => {
    // 检查ComfyUI服务是否可用
    const checkServiceAvailability = async () => {
      try {
        const response = await fetch(comfyUIUrl, { method: 'HEAD' })
        setIsLoading(response.ok ? false : true)
      } catch (error) {
        console.error('无法连接到ComfyUI服务:', error)
        setIsLoading(false) // 即使出错也停止加载状态
      }
    }

    checkServiceAvailability()
  }, [])

  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('files.title')}</NavbarCenter>
      </Navbar>
      <ContentContainer id="content-container">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>正在连接到ComfyUI服务...</p>
          </div>
        ) : (
          <iframe
            src={comfyUIUrl}
            className="w-full h-full border-none"
            title="ComfyUI"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        )}
      </ContentContainer>
    </Container>
  )
}

export default AIimagesPage

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`
const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 100%;
`

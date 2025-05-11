import { h, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  setup() {
    onMounted(() => {
      // 创建粒子特效
      createParticles()
    })
  },
  enhanceApp({ app }) {
    // 应用级别的增强
  }
}

// 创建粒子特效函数
function createParticles() {
  // 等待组件完全渲染
  setTimeout(() => {
    const imageContainer = document.querySelector('.VPHero .image-container')
    if (!imageContainer) return

    // 创建30个粒子
    for (let i = 0; i < 30; i++) {
      createParticle(imageContainer)
    }

    // 每隔一段时间创建新的粒子，保持特效连续
    setInterval(() => {
      for (let i = 0; i < 5; i++) {
        createParticle(imageContainer)
      }
    }, 2000)
  }, 1000)
}

// 创建单个粒子
function createParticle(container) {
  const particle = document.createElement('div')
  particle.className = 'particle'
  
  // 随机位置 - 在logo周围
  const x = Math.random() * 100 - 50
  const y = Math.random() * 100 - 50
  
  // 设置初始位置，围绕在logo周围
  particle.style.left = `calc(50% + ${x}px)`
  particle.style.top = `calc(50% + ${y}px)`
  
  // 随机大小
  const size = Math.random() * 4 + 2
  particle.style.width = `${size}px`
  particle.style.height = `${size}px`
  
  // 随机动画持续时间
  const duration = Math.random() * 2 + 2
  particle.style.animationDuration = `${duration}s`
  
  // 随机延迟
  const delay = Math.random() * 2
  particle.style.animationDelay = `${delay}s`
  
  // 添加到容器
  container.appendChild(particle)
  
  // 动画结束后移除粒子
  setTimeout(() => {
    container.removeChild(particle)
  }, (duration + delay) * 1000)
} 
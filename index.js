document.addEventListener('DOMContentLoaded', () => {
  const pages    = document.querySelectorAll('.page')
  const navLinks = document.querySelectorAll('.nav-link')
  const mnavBtns = document.querySelectorAll('.mnav-btn')

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active-page'))
    navLinks.forEach(l => l.classList.remove('active'))
    mnavBtns.forEach(b => b.classList.remove('active'))
    const target = document.getElementById('page-' + pageId)
    if (target) target.classList.add('active-page')
    navLinks.forEach(l => { if (l.dataset.page === pageId) l.classList.add('active') })
    mnavBtns.forEach(b => { if (b.dataset.page === pageId) b.classList.add('active') })
    window.scrollTo(0, 0)
  }

  navLinks.forEach(l => l.addEventListener('click', e => {
    e.preventDefault()
    showPage(l.dataset.page)
  }))
  mnavBtns.forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)))

  // ── DRAW CANVAS ──
  const canvas   = document.getElementById('draw-canvas')
  const clearBtn = document.getElementById('clear-btn')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let painting  = false

    function resize() {
    const sidebarW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-w')) || 260
    const w = window.innerWidth - sidebarW
    const h = window.innerHeight
    if (w <= 0) return
    const tmp = document.createElement('canvas')
    tmp.width = canvas.width; tmp.height = canvas.height
    tmp.getContext('2d').drawImage(canvas, 0, 0)
    canvas.width = w; canvas.height = h
    ctx.drawImage(tmp, 0, 0)
    }

  function canvasX(e) {
    const sidebarW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-w')) || 260
    return e.clientX - sidebarW
  }
  function canvasY(e) { return e.clientY }

  function startDraw(e) {
    painting = true
    ctx.beginPath()
    ctx.moveTo(canvasX(e), canvasY(e))
  }

  function draw(e) {
    if (!painting) {
      const x = canvasX(e), y = canvasY(e)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 28)
      grad.addColorStop(0, 'rgba(99,102,241,0.10)')
      grad.addColorStop(1, 'rgba(99,102,241,0)')
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, 28, 0, Math.PI * 2)
      ctx.fill()
      return
    }
    e.preventDefault()
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth   = 2.5
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.strokeStyle = 'rgba(99,102,241,0.85)'
    ctx.shadowBlur  = 6
    ctx.shadowColor = 'rgba(99,102,241,0.5)'
    ctx.lineTo(canvasX(e), canvasY(e))
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(canvasX(e), canvasY(e))
  }

  function stopDraw() {
    if (!painting) return
    painting = false
    ctx.beginPath()
    ctx.shadowBlur = 0
  }

  function fadeTick() {
    if (!painting) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'
    }
    requestAnimationFrame(fadeTick)
  }

  canvas.addEventListener('mousedown',  startDraw)
  canvas.addEventListener('mousemove',  draw)
  canvas.addEventListener('mouseup',    stopDraw)
  canvas.addEventListener('mouseleave', stopDraw)
  clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height))

  window.addEventListener('resize', resize)
  resize()
  requestAnimationFrame(fadeTick)
})
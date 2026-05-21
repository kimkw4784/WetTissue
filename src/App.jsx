// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ShieldCheck,
  Leaf,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Layers,
  HelpCircle,
  Award,
  ThumbsUp,
  FileText,
  ArrowUp
} from 'lucide-react';
import hero_package from './assets/images/hero_package.png';
import baby_safety from './assets/images/baby_safety.png';
import biodegradable_fabric from './assets/images/biodegradable_fabric.png';
import './App.css';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [ecoStep, setEcoStep] = useState(0);
  const [isClosingActive, setIsClosingActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refs
  const lenisRef = useRef(null);
  const cursorRef = useRef(null);
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroTissueRef = useRef(null);
  const problemRef = useRef(null);
  const compositionRef = useRef(null);
  const babyImgRef = useRef(null);
  const ecoRef = useRef(null);
  const usabilityRef = useRef(null);
  const proofRef = useRef(null);
  const closingRef = useRef(null);

  // GNB 메뉴 클릭 부드러운 스크롤 핸들러
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetId, {
        offset: 0, // 여백 제거하여 섹션이 화면 최상단에 딱 맞도록 정렬
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  };

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // 인트로 진행 중에는 스크롤 차단 및 메인 애니메이션 작동 대기
    if (isIntroActive) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    // 인트로 종료 시 body 스크롤 복구
    document.body.style.overflow = '';

    // 1. Lenis Smooth Scroll Initialisation
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false, // 모바일 네이티브 스크롤 보장
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lenis scroll binding to ScrollTrigger
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      setScrolled(e.scroll > 50);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. GSAP Animations

    // Hero Section Load Animation
    const heroCtx = gsap.context(() => {
      // Intro animations
      gsap.fromTo('.hero-badge, .hero-title, .hero-desc, .hero-cta-group',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
      );

      gsap.fromTo('.hero-package-img',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
      );

      // 물티슈가 위로 쏙 올라오는 모션 (Y축 슬라이드)
      gsap.fromTo(heroTissueRef.current,
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.6, delay: 0.6, ease: 'cubic-bezier(0.25, 1, 0.5, 1)' }
      );

      // Hero Scroll Animation (물티슈가 화면 밖으로 페이드아웃)
      gsap.to(heroTissueRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom center',
          scrub: 1,
        },
        y: -100,
        opacity: 0,
        scale: 0.85
      });
    }, heroRef);

    // Section 2: Problem Stagger Float & Fade-in
    const problemCtx = gsap.context(() => {
      gsap.fromTo('.problem-card',
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: problemRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out'
        }
      );
    }, problemRef);

    // Section 3: Feature 1 (Composition) - Baby Image Scale and Text Fade
    const compCtx = gsap.context(() => {
      // Baby Image Zoom
      gsap.fromTo(babyImgRef.current,
        { scale: 1.0 },
        {
          scrollTrigger: {
            trigger: compositionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          scale: 1.05,
          ease: 'none'
        }
      );

      // Spec List items fade-in from right
      gsap.fromTo('.spec-item',
        { x: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: compositionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out'
        }
      );
    }, compositionRef);

    // Section 4: Feature 2 (Eco-Friendly Timeline) Pinning & Progress
    const ecoCtx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;

      if (!isMobile) {
        // Desktop Screen Animation
        ScrollTrigger.create({
          trigger: ecoRef.current,
          start: 'top bottom',
          end: 'center center',
          // pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            // Progress Bar Width
            gsap.to('.eco-timeline-progress', { width: `${progress * 100}%`, duration: 0.1 });

            // Step Activation based on progress
            if (progress < 0.25) setEcoStep(1);
            else if (progress < 0.50) setEcoStep(2);
            else if (progress < 0.75) setEcoStep(3);
            else if (progress < 0.99) setEcoStep(4);
            else setEcoStep(5);
          }
        });
      } else {
        // Mobile simple fade-in and default active state
        setEcoStep(5);
        gsap.fromTo('.eco-step',
          { y: 30, opacity: 0 },
          {
            scrollTrigger: {
              trigger: ecoRef.current,
              start: 'top 80%',
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15
          }
        );
      }
    }, ecoRef);

    // Section 5: Feature 3 (Usability Before/After) Slide in
    const usabilityCtx = gsap.context(() => {
      gsap.fromTo('.before-card',
        { x: -120, opacity: 0 },
        {
          scrollTrigger: {
            trigger: usabilityRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out'
        }
      );

      gsap.fromTo('.after-card',
        { x: 120, opacity: 0 },
        {
          scrollTrigger: {
            trigger: usabilityRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out'
        }
      );
    }, usabilityRef);

    // Section 6: Proof & Trust - Stagger Grid Cards
    const proofCtx = gsap.context(() => {
      gsap.fromTo('.proof-card',
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: proofRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out'
        }
      );
    }, proofRef);

    // Section 7: Closing & CTA - Background Color Transition & Scaling
    const closingCtx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: closingRef.current,
        start: 'top 60%',
        end: 'bottom bottom',
        onEnter: () => setIsClosingActive(true),
        onLeaveBack: () => setIsClosingActive(false),
      });
    }, closingRef);

    // TOP 버튼 초록 배경 대응 스크롤 트리거 컨텍스트
    const scrollTopCtx = gsap.context(() => {
      const greenSections = ['.problem-section', '.footer'];

      greenSections.forEach(selector => {
        ScrollTrigger.create({
          trigger: selector,
          start: 'top 92%', // 버튼 하단 30px 위치 고려
          end: 'bottom 92%',
          onEnter: () => document.querySelector('.scroll-to-top')?.classList.add('on-green'),
          onLeave: () => document.querySelector('.scroll-to-top')?.classList.remove('on-green'),
          onEnterBack: () => document.querySelector('.scroll-to-top')?.classList.add('on-green'),
          onLeaveBack: () => document.querySelector('.scroll-to-top')?.classList.remove('on-green'),
        });
      });

      ScrollTrigger.create({
        trigger: closingRef.current,
        start: 'top 60%',
        end: 'bottom 92%',
        onEnter: () => document.querySelector('.scroll-to-top')?.classList.add('on-green'),
        onLeave: () => document.querySelector('.scroll-to-top')?.classList.remove('on-green'),
        onEnterBack: () => document.querySelector('.scroll-to-top')?.classList.add('on-green'),
        onLeaveBack: () => document.querySelector('.scroll-to-top')?.classList.remove('on-green'),
      });
    });

    return () => {
      lenis.destroy();
      heroCtx.revert();
      problemCtx.revert();
      compCtx.revert();
      ecoCtx.revert();
      usabilityCtx.revert();
      proofCtx.revert();
      closingCtx.revert();
      scrollTopCtx.revert();
    };
  }, [isIntroActive]);

  // 3. 바람에 휘날리는 물티슈 커스텀 커서 핸들링
  useEffect(() => {
    // 터치 디바이스가 있거나 가로 768px 이하 모바일 환경에서는 커스텀 커서 비활성화
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth <= 768) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.style.display = 'block';

    // GSAP quickTo를 사용해 마우스 추적 딜레이를 주어 쫀득하고 부드러운 물리 효과 부여
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3.out" });

    const onMouseMove = (e) => {
      xTo(e.clientX + 30);
      yTo(e.clientY + 30);
    };

    window.addEventListener('mousemove', onMouseMove);

    // 버튼, 링크, 캡 뚜껑 등에 호버 시 피드백 클래스 처리
    const handleMouseEnter = () => cursor.classList.add('hovering');
    const handleMouseLeave = () => cursor.classList.remove('hovering');

    let boundElements = [];
    const bindHoverEvents = () => {
      const elms = document.querySelectorAll('a, button, [role="button"], .intro-cap-lid, .intro-cap-base, input, select');
      elms.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
      boundElements = elms;
    };

    // React 컴포넌트 렌더링 타이밍을 맞추기 위해 지연 호출
    const timer = setTimeout(bindHoverEvents, 200);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(timer);
      boundElements.forEach(el => {
        if (el) {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
    };
  }, [isIntroActive]);

  const handleIntroComplete = () => {
    window.scrollTo(0, 0);
    setIsIntroActive(false);
  };

  return (
    <>
      {isIntroActive && <Intro onComplete={handleIntroComplete} />}

      <div className={`app-container ${isIntroActive ? 'intro-blur' : 'intro-fade-in'}`}>
        {/* GNB */}
        <nav className={`gnb ${scrolled ? 'scrolled' : ''}`}>
          <div className="gnb-logo">
            ForestPure <span>안심케어</span>
          </div>
          <ul className="gnb-menu">
            <li><a href="#problem" onClick={(e) => handleNavClick(e, '#problem')}>육아고민</a></li>
            <li><a href="#composition" onClick={(e) => handleNavClick(e, '#composition')}>식품등급성분</a></li>
            <li><a href="#eco" onClick={(e) => handleNavClick(e, '#eco')}>100%생분해</a></li>
            <li><a href="#usability" onClick={(e) => handleNavClick(e, '#usability')}>사용성기술</a></li>
            <li><a href="#proof" onClick={(e) => handleNavClick(e, '#proof')}>인증스펙</a></li>
          </ul>
          <a href="#closing" className="gnb-cta" onClick={(e) => handleNavClick(e, '#closing')}>
            구매하기
          </a>
        </nav>

        {/* Section 1: Hero */}
        <section ref={heroRef} className="hero-section" id="hero">
          <div className="container hero-grid">
            <div ref={heroTextRef} className="hero-text">
              <div className="hero-badge">
                <ShieldCheck size={16} />
                <span>전성분 식품 등급 & 100% 생분해 안심 물티슈</span>
              </div>
              <h1 className="hero-title">
                입가에 닿아도 안심,<br />
                지구에도 안심.
              </h1>
              <p className="hero-desc">
                성분부터 친환경 원사, 한 장씩 쏙 뽑히는 기술력까지.<br />
                사랑하는 내 아기를 위해 타협 없이 빚어낸 완벽한 한 장을 경험하세요.
              </p>
              <div className="hero-cta-group">
                <button className="btn-primary" onClick={() => document.getElementById('closing').scrollIntoView({ behavior: 'smooth' })}>
                  우리 아기 첫 물티슈 시작하기
                  <ArrowRight size={20} />
                </button>
                <a href="#problem" className="btn-secondary">
                  더 알아보기
                </a>
              </div>
            </div>
            <div className="hero-graphic-container">
              <div className="hero-circle-deco"></div>
              {/* 쏙 올라오는 물티슈 오브젝트 */}
              {/* <div ref={heroTissueRef} className="tissue-paper-overlay">
                <div className="tissue-label">
                  Pure Rayon 100%
                </div>
              </div> */}
              <img
                src={hero_package}
                alt="ForestPure Premium Wet Wipes Package"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Problem */}
        <section ref={problemRef} className="problem-section" id="problem">
          <div className="container">
            <span className="section-tag">Parent's Pain Point</span>
            <h2 className="section-title">
              아기 입가를 닦아줄 때마다 밀려오던 찜찜함,<br />
              엄마의 잘못이 아닙니다.
            </h2>
            <p className="section-desc">
              매일 마주하는 작은 불편함과 불안들이 육아를 더 힘들게 만듭니다. 이제 더 이상 타협하거나 미안해하지 마세요.
            </p>

            <div className="problem-grid">
              <div className="problem-card" id="problem-card-1">
                <div className="problem-card-num">01</div>
                <h3 className="problem-card-title">화학 보존제에 대한 불안</h3>
                <p className="problem-card-desc">
                  아기 입가와 손을 닦을 때마다 혹시 모를 화학 물질이 흡수되진 않을까 마음 놓고 닦이지 못하셨나요?
                </p>
              </div>
              <div className="problem-card" id="problem-card-2">
                <div className="problem-card-num">02</div>
                <h3 className="problem-card-title">플라스틱 원사의 환경 죄책감</h3>
                <p className="problem-card-desc">
                  매달 수백 장씩 버려지는 폴리에스터 혼방 물티슈가 수백 년 동안 썩지 않고 미세 플라스틱으로 남는다는 것에 죄책감을 느끼셨나요?
                </p>
              </div>
              <div className="problem-card" id="problem-card-3">
                <div className="problem-card-num">03</div>
                <h3 className="problem-card-title">뭉쳐 나오는 물티슈 스트레스</h3>
                <p className="problem-card-desc">
                  급하게 한 장만 필요한데 줄줄이 뭉쳐 나와 낭비하고, 다시 쑤셔 넣느라 위생을 걱정하며 짜증 냈던 육아 환경을 겪으셨나요?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Feature 1 - 성분 */}
        <section ref={compositionRef} className="feature-composition" id="composition">
          <div className="container composition-grid">
            <div className="baby-img-wrapper">
              <img
                src={baby_safety}
                alt="안심하는 아기의 행복한 얼굴"
              />
              <div className="composition-badge">
                <div className="composition-badge-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="composition-badge-text">
                  <h4>All Green Grade</h4>
                  <p>EWG 그린 등급 및 식품 등급 보존제</p>
                </div>
              </div>
            </div>

            <div className="composition-content">
              <span className="section-tag">Pure Ingredients</span>
              <h2 className="section-title">
                먹어도 안심할 수 있도록.<br />
                전성분표의 마지막 한 줄까지 '식품 등급'으로만 채웠습니다.
              </h2>
              <p className="section-desc">
                단순히 위험 성분을 배제하는 것을 넘어, 구강 청결제 등에 들어가는 식품 등급 보존제와 천연 추출물만을 고집하여 입가에 직접 닿아도 어떤 해가 없습니다.
              </p>

              <div className="spec-list">
                <div className="spec-item" id="spec-item-1">
                  <div className="spec-icon">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="spec-content">
                    <h3>100% 식품 첨가물 등급 보존제</h3>
                    <p>일반 화학 보존제 대신 안전한 식품용 보존 시스템을 적용하여, 아기가 실수로 물티슈를 입에 대거나 쪽쪽 빨아도 완전히 무해합니다.</p>
                  </div>
                </div>
                <div className="spec-item" id="spec-item-2">
                  <div className="spec-icon">
                    <Sparkles size={24} />
                  </div>
                  <div className="spec-content">
                    <h3>초순수 11단계 정제 필터</h3>
                    <p>국가 공인 기준을 뛰어넘는 11단계의 역삼투압 미세 정수 필터를 거쳐 세균과 중금속을 완벽히 걸러낸 물만 가득 채웠습니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Feature 2 - 친환경 */}
        <section ref={ecoRef} className="feature-eco" id="eco">
          <div className="container eco-container">
            <span className="section-tag">100% Biodegradable</span>
            <h2 className="section-title">
              플라스틱 제로.<br />
              내 아이가 살아갈 내일을 위해, 흔적 없이 자연으로 돌아가는 한 장.
            </h2>
            <p className="section-desc">
              환경 오염 걱정 없는 100% 생분해 레이온 원사. 흙 속 미생물에 의해 최단 기간 자연 분해되어 지구에 어떤 흔적도 남기지 않습니다.
            </p>

            {/* Desktop Timeline Graphic (Pinned) */}
            <div className="eco-timeline-wrapper">
              <div className="eco-timeline-track">
                <div className="eco-timeline-progress"></div>
              </div>
              <div className="eco-timeline-steps">
                <div className={`eco-step ${ecoStep >= 1 ? 'active' : ''}`} id="eco-step-1">
                  <div className="eco-step-node">
                    <Layers size={32} />
                  </div>
                  <h4>1단계: 생분해 원단</h4>
                  <p>나무에서 추출한 자연 유래 프리미엄 100% 레이온 원사</p>
                </div>
                <div className={`eco-step ${ecoStep >= 2 ? 'active' : ''}`} id="eco-step-2">
                  <div className="eco-step-node">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4>2단계: 실생활 사용</h4>
                  <p>미세 플라스틱 방출 없이 부드러운 아기 케어</p>
                </div>
                <div className={`eco-step ${ecoStep >= 3 ? 'active' : ''}`} id="eco-step-3">
                  <div className="eco-step-node">
                    <Trash2 size={32} />
                  </div>
                  <h4>3단계: 자연 폐기</h4>
                  <p>일반 쓰레기로 버려진 후 토양 매립 시작</p>
                </div>
                <div className={`eco-step ${ecoStep >= 4 ? 'active' : ''}`} id="eco-step-4">
                  <div className="eco-step-node">
                    <RefreshCw size={32} />
                  </div>
                  <h4>4단계: 미생물 분해</h4>
                  <p>흙 속 수분과 미생물 작용으로 신속하게 분해 진행</p>
                </div>
                <div className={`eco-step ${ecoStep >= 5 ? 'active' : ''}`} id="eco-step-5">
                  <div className="eco-step-node">
                    <Leaf size={32} />
                  </div>
                  <h4>5단계: 자연 회귀 완료</h4>
                  <p>흔적 없이 분해되어 땅 속 영양분으로 완전히 회귀</p>
                </div>
              </div>
            </div>

            <div className="eco-graphics-row">
              <div className="eco-graphic-card">
                <div className="eco-image-wrapper">
                  <img
                    src={biodegradable_fabric}
                    alt="흙 속에서 분해되는 친환경 물티슈 원사"
                  />
                </div>
                <h3>미세플라스틱 0% 정식 인증</h3>
                <p>석유계 폴리에스터 합성 섬유를 단 1%도 혼방하지 않아 연소 및 부패 과정에서 유독 물질이나 플라스틱 잔류를 전혀 발생시키지 않습니다.</p>
              </div>
              <div className="eco-graphic-card">
                <div className="eco-image-wrapper" style={{ backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
                  <Leaf size={100} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3>산림 보증 FSC 인증 완료</h3>
                <p>무분별한 파괴가 아닌 체계적으로 관리되는 지속 가능한 숲의 목재 펄프만을 수확하여 제조하였습니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Feature 3 - 사용성 (육아 UX) */}
        <section ref={usabilityRef} className="feature-usability" id="usability">
          <div className="container">
            <div style={{ textAlign: 'center' }}>
              <span className="section-tag">Ergonomic UX Design</span>
              <h2 className="section-title">
                전쟁 같은 육아 속에서,<br />
                단 한 번의 딸림 없이 정확하게 한 장씩 쏙.
              </h2>
              <p className="section-desc" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                한 손에는 아기 다리를 붙잡고 한 손으로 빠르게 뽑아 써야 하는 다급한 순간, 엉키거나 뭉침 없이 부드럽게 분리되는 One-by-One 딸림 방지 기술을 경험하세요.
              </p>
            </div>

            <div className="usability-grid">
              {/* Before Card */}
              <div className="usability-card before-card" id="usability-before">
                <span className="usability-badge bad">일반 물티슈</span>
                <div className="usability-visual">
                  <div className="bad-tissue-mock">
                    <div className="bad-tissue-item">줄줄이 뭉쳐나옴 (4장)</div>
                    <div className="bad-tissue-item" style={{ animationDelay: '0.5s' }}>뒤엉킴</div>
                  </div>
                </div>
                <div className="usability-content">
                  <h3>불필요한 낭비와 위생 저하</h3>
                  <p>뽑을 때 뒤따라 나오는 다음 장들을 다시 밀어 넣거나 억지로 떼어 쓰며 세균 감염 불안감과 낭비를 초래합니다.</p>
                </div>
              </div>

              {/* After Card */}
              <div className="usability-card after-card" id="usability-after">
                <span className="usability-badge good">ForestPure 안심 기술</span>
                <div className="usability-visual">
                  <div className="good-tissue-mock">
                    <div className="good-package">
                      <div className="good-package-cap"></div>
                    </div>
                    <div className="good-tissue-sheet"></div>
                  </div>
                </div>
                <div className="usability-content">
                  <h3>One-by-One 딸림 방지 인터록킹</h3>
                  <p>폴딩 각도와 탄성을 극대화한 독자적인 정밀 인터록킹 설계로, 어떤 각도와 세기로 뽑아도 오직 정확히 단 한 장만 딸려 올라옵니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Proof & Trust (신뢰 종결) */}
        <section ref={proofRef} className="proof-section" id="proof">
          <div className="container">
            <span className="section-tag">Scientific Verification</span>
            <h2 className="section-title">
              깐깐한 엄마의 눈으로 직접 검증하세요.<br />
              수치와 인증으로 증명하는 무결점 안전성.
            </h2>
            <p className="section-desc">
              맘카페 리뷰나 광고가 아닌, 공신력 있는 국내외 보건 인증 기관의 까다로운 검증을 마쳐 스마트 컨슈머에게 완전한 논리적 해답을 드립니다.
            </p>

            <div className="proof-grid">
              <div className="proof-card premium-badge" id="proof-card-1">
                <div className="proof-badge-icon">EXCELLENT</div>
                <h3 className="proof-card-title">독일 더마테스트 최고 등급</h3>
                <p className="proof-card-desc">
                  세계적인 피부과학 연구소 독일 더ma테스트의 무자극 엑설런트(Excellent) 최상위 등급을 획득하였습니다.
                </p>
              </div>
              <div className="proof-card" id="proof-card-2">
                <div className="proof-badge-icon">0.00%</div>
                <h3 className="proof-card-title">피부 자극도 0.00 무자극 판정</h3>
                <p className="proof-card-desc">
                  국내 임상 지원자 대상 피부 저자극 테스트 결과 자극도 0.00% 지수로 완전 무자극 물질임을 증명했습니다.
                </p>
              </div>
              <div className="proof-card" id="proof-card-3">
                <div className="proof-badge-icon">ALL GREEN</div>
                <h3 className="proof-card-title">화해·맘가이드 성분 검증 통과</h3>
                <p className="proof-card-desc">
                  꼼꼼한 부모들이 신뢰하는 전성분 분석 앱 화해와 맘가이드 기준 유해 성분 Zero 및 추천 안전 등급을 받았습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Closing & CTA */}
        <section ref={closingRef} className={`closing-section ${isClosingActive ? 'bg-active' : ''}`} id="closing">
          <div className="closing-bg-decor"></div>
          <div className="container">
            <div className="closing-content">
              <h2 className="closing-title">
                이제 성분 고민도, 환경 죄책감도,<br />
                쓸 때의 짜증도 모두 내려놓으세요.
              </h2>
              <p className="closing-desc">
                아기의 맑은 미소와 우리가 함께 지켜나갈 깨끗한 미래를 위해,<br />
                성분부터 친환경 원단, 정밀 설계까지 완벽하게 완성된 ForestPure와 오늘 시작하세요.
              </p>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                우리 아기 첫 안심 물티슈 시작하기
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-info">
                <h3>ForestPure</h3>
                <p>주식회사 포레스트퓨어는 자연 유래 친환경 바이오 소재를 연구하여 아기와 환경이 함께 안심할 수 있는 지속 가능한 육아 라이프스타일을 제안합니다.</p>
                <p>© 2026 ForestPure Inc. All rights reserved.</p>
              </div>
              <div className="footer-links">
                <h4>제품 정보</h4>
                <ul>
                  <li><a href="#composition" onClick={(e) => handleNavClick(e, '#composition')}>식품 등급 성분 정보</a></li>
                  <li><a href="#eco" onClick={(e) => handleNavClick(e, '#eco')}>100% 생분해 레이온 원단</a></li>
                  <li><a href="#usability" onClick={(e) => handleNavClick(e, '#usability')}>One-by-One 딸림 방지 특허</a></li>
                  <li><a href="#proof" onClick={(e) => handleNavClick(e, '#proof')}>시험 성적서 조회</a></li>
                </ul>
              </div>
              <div className="footer-links">
                <h4>고객지원</h4>
                <ul>
                  <li><a href="#!">자주 묻는 질문 (FAQ)</a></li>
                  <li><a href="#!">대량 구매 및 제휴 문의</a></li>
                  <li><a href="#!">1:1 카톡 안심 상담</a></li>
                  <li><a href="#!">반품 및 환불 정책</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <div>
                대표이사: 김정우 | 주소: 서울시 성동구 성수이로 123 포레스트타워 7층 | 사업자등록번호: 120-81-12345
              </div>
              <div className="footer-socials">
                <a href="#!" className="footer-social-icon"><ThumbsUp size={18} /></a>
                <a href="#!" className="footer-social-icon"><Award size={18} /></a>
                <a href="#!" className="footer-social-icon"><FileText size={18} /></a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* 우측 하단 플로팅 TOP 버튼 */}
      <button
        className="scroll-to-top"
        onClick={(e) => handleNavClick(e, '#hero')}
        aria-label="최상단으로 이동"
      >
        <ArrowUp size={22} />
      </button>

      {/* 바람에 휘날리는 커스텀 물티슈 마우스 커서 */}
      <div ref={cursorRef} className="custom-tissue-cursor">
        <svg viewBox="0 0 40 30" width="40" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 8 C4 8 10 4 20 6 C30 8 36 4 36 4 C36 4 38 12 34 22 C30 32 18 26 12 28 C6 30 2 24 2 24 C2 24 4 16 4 8 Z"
            fill="rgba(255, 255, 255, 0.95)"
            stroke="rgba(19, 59, 38, 0.2)"
            strokeWidth="1.5"
          />
          <path d="M10 10 C14 11 18 10 22 12" stroke="rgba(19, 59, 38, 0.15)" strokeWidth="1" strokeLinecap="round" />
          <path d="M8 16 C14 17 20 15 26 18" stroke="rgba(19, 59, 38, 0.15)" strokeWidth="1" strokeLinecap="round" />
          <path d="M12 22 C16 23 20 22 24 23" stroke="rgba(19, 59, 38, 0.15)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* 구매 감사 모달 팝업 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <Sparkles size={32} />
            </div>
            <h3 className="modal-title">구매를 결심해 주셔서 감사합니다!</h3>
            <p className="modal-desc">
              ForestPure 안심 물티슈와 함께 아기와 지구 모두 안심할 수 있는<br />지속 가능한 안심 케어가 시작되었습니다.<br />
              정성껏 준비하여 빠르게 배송해 드리겠습니다.
            </p>
            <button className="btn-modal-close" onClick={() => setIsModalOpen(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// 3D & GSAP 기반 인터랙티브 인트로 시퀀스 컴포넌트
function Intro({ onComplete }) {
  const containerRef = useRef(null);
  const packageRef = useRef(null);
  const lidRef = useRef(null);
  const tissueRef = useRef(null);
  const holeRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // 초기 상태 정의 (뚜껑은 기본 Z축 위에 안착, 구멍과 물티슈는 완전히 숨김)
    // 뚜껑 z값을 높게 설정하여 열릴 때 로고 위를 3D 공간에서 물리적으로 덮도록 합니다.
    gsap.set(lidRef.current, { rotateX: 0, z: 20, transformPerspective: 900, transformOrigin: "center top" });
    gsap.set(holeRef.current, { opacity: 0, visibility: 'hidden' });
    gsap.set(tissueRef.current, { scaleY: 0, scaleX: 0.3, opacity: 0, y: 12, visibility: 'hidden', transformPerspective: 1200, transformOrigin: "center bottom" });

    // 1단계: 캡(뚜껑)이 닫힌 물티슈를 온전한 수직 Top-View 카메라 시점에서 줌인 및 안착
    tl.fromTo(packageRef.current,
      {
        scale: 0.75,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        opacity: 0,
        y: 40,
      },
      {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        opacity: 1,
        y: 0,
        duration: 1.8,
        ease: 'power3.out'
      }
    );

    // 2단계: 물티슈 캡(뚜껑)이 3D 회전하며 카메라 방향(앞쪽)으로 열림
    // rotateX: 양수 → 뚜껑 아랫면이 Z+ 방향(카메라 쪽)으로 펼쳐짐
    // 뚜껑이 translateZ(20px) 위치에서 앞으로 더 열리므로 로고(Z=0) 위를 완전히 덮음
    // 뚜껑 안쪽 회색 면(intro-cap-lid-back)이 카메라를 향해 열린 상태를 자연스럽게 표현
    tl.to(lidRef.current, {
      rotateX: 140,
      z: 20,
      duration: 1.1,
      ease: 'power2.inOut'
    }, '+=0.2');



    // 뚜껑이 충분히 열린 직후, 내부 구멍과 물티슈가 동시에 활성화되며 자연스럽게 노출됨
    tl.to(holeRef.current, {
      onStart: () => {
        gsap.set([holeRef.current, tissueRef.current], { visibility: 'visible' });
      },
      opacity: 1,
      duration: 0.3,
      ease: 'power1.out'
    }, '-=0.3');

    tl.to(tissueRef.current, {
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'back.out(1.8)'
    }, '-=0.3');

    // 3단계: 물티슈가 살짝 보이는 구멍 속으로 빨려들어감
    tl.to(tissueRef.current, {
      y: 35,
      scaleY: 0.05,
      scaleX: 0.2,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.in'
    }, '+=0.4');

    // 카메라가 구멍 속으로 빨려들어가는 연출: '구멍' 자체가 Z축으로도 튀어나오며 거대하게 확대됨
    tl.to(holeRef.current, {
      scale: 150,
      z: 100,
      duration: 0.5,
      ease: 'expo.in'
    }, '-=0.3');

    // 뚜껑은 처음부터 사라지지 않고, 구멍이 충분히 거대해져서 뚜껑을 덮칠 즈음(확대 애니메이션 후반부)에 맞춰 사라짐
    tl.to(lidRef.current, {
      opacity: 0,
      duration: 0.05
    }, '<0.35'); // 구멍 확대 시작 후 0.35초 뒤에 발동 (총 0.5초 중)

    // 4단계: 영상 시퀀스가 끝나며 전체 인트로 컨테이너 페이드 아웃
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="intro-container">
      <div className="intro-scene">
        <div ref={packageRef} className="intro-package">
          <div className="intro-package-body">
            <div className="intro-package-logo-wrapper">
              <div className="intro-package-logo">ForestPure</div>
            </div>

            <div className="intro-cap">
              <div className="intro-cap-base">
                {/* 구멍 영역에 ref를 바인딩하여 제어 */}
                <div ref={holeRef} className="intro-cap-hole">
                  {/* 구멍 속 물티슈 */}
                  <div ref={tissueRef} className="intro-tissue-paper">
                    <div className="intro-tissue-line"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 뚜껑을 로고와 같은 레벨(package-body 직접 자식)로 배치 */}
            {/* 이렇게 해야 회전 시 3D 공간에서 로고 위를 물리적으로 덮을 수 있음 */}
            <div ref={lidRef} className="intro-cap-lid">
              <div className="intro-cap-lid-front">
                <div className="intro-cap-lid-tab"></div>
                <div className="intro-cap-lid-brand">FP</div>
              </div>
              <div className="intro-cap-lid-back"></div>
            </div>

            <div className="intro-package-info">
              <span>All Green Grade</span>
              <span>100% Biodegradable</span>
            </div>
          </div>
        </div>
      </div>
      <div className="intro-ambient-light"></div>
    </div>
  );
}

export default App;
